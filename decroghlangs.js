window.onload = function() {
    const formsubmitbutton = document.getElementById("form_submit");
    
    formsubmitbutton.onclick = async function() {
        const username = document.getElementById("form_ghusername")
            .value;
        
        const repositoriesdata = await fetch(
            "https://api.github.com/users/" + username + "/repos"
        );
            
        const repositoriesdata_json = await repositoriesdata.json();
            
        let chart;
        
        let global_languagesmap_bytes = new Map();
        let global_languagesmap_percentage = new Map();
        let total_bytes_of_code = 0;
        
        for (const repository of repositoriesdata_json) {
            let local_languagesmap = await fetch(repository.languages_url);
            let local_languagesmap_json = await local_languagesmap.json();
            
            for (
                const [language, written_bytes]
                of Object.entries(local_languagesmap_json)
            ) {
                total_bytes_of_code += written_bytes;
                    
                if (global_languagesmap_bytes.has(language)) {
                    global_languagesmap_bytes.set(
                        language,
                        global_languagesmap_bytes.get(
                            language
                        ) + written_bytes
                    );

                    continue;
                }
                            
                global_languagesmap_bytes.set(language, written_bytes);
            }
        }
                    
        for (
            const [language, written_bytes]
            of global_languagesmap_bytes.entries()
        ) {
            /*
                cross-multiplication

                total_bytes_of_code ------------------- 100%
                written_bytes ------------------------- x%

                x = 100 * written_bytes / total_bytes_of_code
            */

            let currentlanguage_percentage =
                100 * written_bytes / total_bytes_of_code;
            
            currentlanguage_percentage = Math.round(
                currentlanguage_percentage
            );
            
            global_languagesmap_percentage.set(
                language,
                currentlanguage_percentage
            );
        }

        global_languagesmap_bytes.clear();

        chart = document.getElementById("toplangschart");
        chart.innerHTML = "";
        
        for (
            const [language, percentage]
            of global_languagesmap_percentage.entries()
        ) {
            chart.innerHTML += "[";

            for (let i = 0; i < 10; ++i) {
                chart.innerHTML += Math.round(percentage / 10) >= i
                    ? "#"
                    : "-";
            }

            chart.innerHTML +=
                "] " + percentage + "% " + language + "<br>";
        }
    };
}
