export type DropdownOption = {
    displayName: string;
    id: string;
}

export function BuildDropdownOptionList(options: DropdownOption[]): string[] {
    return options.map(element => {
        return `<option value="${element.id}">${element.displayName}</option>`;
    });
}

export const CommandCenterPage: string = `<!DOCTYPE html>
<html>
    <head>
        <title>%%PAGETITLE%%</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
            body {
                background-color: #000;
                color: #fff;
                font-family: 'Open Sans', sans-serif;
                font-size: 12pt;
                margin: 5px;
            }

            .main-div {
                text-align: center;
                width: 100%;
            }

            a {
                text-decoration: none;
                color: #06f;
            }
                a:hover {
                    text-decoration: underline;
                }
            
            h1, h2 {
                text-align: center;
            }

            button {
                width: 280px;
                min-height: 60px;
                padding: 16px;
                border: 0;
                border-radius: 5px;
                background-color: #33c;
                color: #fff;
                font-family: 'Open Sans', sans-serif;
                font-size: 1.25em;
                font-weight: bold;
                cursor: pointer;
            }
                button:hover{
                    background-color: #33f;    
                }
                button:active {
                    background-color: #339;
                }

            input, select {
                width: 360px;
                border: 1px solid #999;
                box-sizing: border-box;
                background-color: #666;
                color: #fff;
                padding: 8px;
                font-family: 'Open Sans', sans-serif;
                font-size: 1em;
            }
            
            .button-list {
                padding-left: 0;
                text-align: center;
            }
            
            .button-list li {
                list-style: none;
                margin-bottom: 20px;
            }
        </style>

        <script type="text/javascript">

            function firebotApiRootUrl() {
                return 'http://%%HOSTNAME%%:%%PORT%%/api/v1';
            }

            async function runFirebotSystemCommand(cmdId, args) {
                let url = \`\${firebotApiRootUrl()}/commands/system/\${cmdId}/run\`;

                if (args != null) {
                    url = \`\${url}?args=\${args}\`;
                }

                const response = await fetch(url);
            }

            async function runFirebotCustomCommand(cmdId, args) {
                let url = \`\${firebotApiRootUrl()}/commands/custom/\${cmdId}/run\`;

                if (args != null) {
                    url = \`\${url}?args=\${args}\`;
                }

                const response = await fetch(url);
            }

        </script>
    </head>
    <body>
        <div id="main-div">
            <h1>%%PAGETITLE%%</h1>

            <h2>Custom Commands</h2>
            <ul class="button-list">
                <li>
                    <select id="customCommandDropdown">
                        %%CUSTOM_COMMAND_OPTIONS%%
                    </select>
                </li>
                <li><input type="text" id="customCommandParameters" placeholder="Command Parameters" /></li>
                <li><button onClick="runFirebotCustomCommand(document.getElementById('customCommandDropdown').value, document.getElementById('customCommandParameters').value);">Run Custom Command</button></li>
            </ul>

            <h2>System Commands</h2>
            <ul class="button-list">
                <li>
                    <select id="systemCommandDropdown">
                        %%SYSTEM_COMMAND_OPTIONS%%
                    </select>
                </li>
                <li><input type="text" id="systemCommandParameters" placeholder="Command Parameters" /></li>
                <li><button onClick="runFirebotCustomCommand(document.getElementById('systemCommandDropdown').value, document.getElementById('systemCommandParameters').value);">Run System Command</button></li>
            </ul>
        </div>
    </body>
</html>`