const get_username = (): string => {
    return (<HTMLInputElement>document.getElementById("form_ghusername")).value;
};

const get_repositories = async (username: string): Promise<Array<Object>> => {
    const repositories = await fetch("https://api.github.com/users/" + username + "/repos");
    return await repositories.json();
};

const get_languages = async (repository): Promise<Object> => {
    const languages = await fetch(repository.languages_url);
    return await languages.json();
};

const get_languages_bytes = async (): Promise<[Map<string, number>, number]> => {
    const repositories = await get_repositories(get_username());
    
    let languages_bytes: Map<string, number> = new Map();
    let total_bytes_of_code = 0;
    
    for (const repository of repositories) {
        const languages = await get_languages(repository);
        
        for (const [name, written_bytes] of Object.entries(languages)) {
            total_bytes_of_code += written_bytes;
            
            if (languages_bytes.has(name)) {
                languages_bytes.set(name, languages_bytes.get(name) + written_bytes);
                continue;
            }
            
            languages_bytes.set(name, written_bytes);
        }
    }
    
    return [languages_bytes, total_bytes_of_code];
};

const get_languages_percentage = async (): Promise<Map<string, number>> => {
    const [languages_bytes, total_bytes_of_code] = await get_languages_bytes();
    let languages_percentage: Map<string, number> = new Map();
    
    languages_bytes.forEach((written_bytes: number, language: string) => {
        /*
            cross-multiplication

            total_bytes_of_code ------------------- 100%
            written_bytes ------------------------- x%git@github.com:guilhermenevesxyz/collatzover.git
            
            x = 100 * written_bytes / total_bytes_of_code
        */
        
        let current_language_percentage = 100 * written_bytes / total_bytes_of_code;
        current_language_percentage = Math.round(current_language_percentage);
            
        languages_percentage.set(language, current_language_percentage);
    });
    
    return languages_percentage;
};

const update_chart = async () => {
    let chart = document.getElementById("toplangschart");
    chart.innerHTML = "Loading results...";
    
    const languages_percentage = await get_languages_percentage();
    
    chart.innerHTML = "";
    
    languages_percentage.forEach((percentage: number, language: string) => {
        chart.innerHTML += "[";
        
        for (let i = 0; i < 10; ++i) {
            chart.innerHTML += Math.round(percentage / 10) >= i ? "#" : "-";
        }

        chart.innerHTML += "] " + percentage + "% " + language + "<br>";
    });
    
    return false;
};

window.onload = () => {
    document.getElementById("form_container").onsubmit = (event) => {
        event.preventDefault();
        update_chart();
    };
};
