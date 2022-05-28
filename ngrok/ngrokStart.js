const rJS = require("E:/CLOUDCODE/github.com/oListRepos/NodeJS/oModules/rJS.js");
const rNode = require("E:/CLOUDCODE/github.com/oListRepos/NodeJS/oModules/rNode.js");
const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
rJS.Fetch.setAxios(axios);
const webappUrl = `https://script.google.com/macros/s/AKfycbwiDXlcuAtAsouDM8k_Jc_DlHTyTJazWaIUPCO-2RJk62_Sd4EJYn4GiBzLRI4iSzk/exec`;
(async () => {
   const dir = path.dirname(__filename);
   let ngrokBin = path.join(dir, `ngrok-${process.arch === "x64" ? "x64" : "x32"}.exe`);
   let ngrokConfig = path.join(dir, "ngrok.yml");
   let args = ["start", "--all", "--config", ngrokConfig];
   if (fs.existsSync(ngrokBin) === false) {
      console.warn(`FILE NOT FOUND: ${ngrokBin}`);
      return;
   }
   if (fs.existsSync(ngrokConfig) === false) {
      console.warn(`FILE NOT FOUND: ${ngrokConfig}`);
      return;
   }
   const checkAuthToken = async () => {
      let content = fs.readFileSync(ngrokConfig, "utf-8");
      if (content.includes("webapp_authtoken")) {
         let searchToken = await rJS.Fetch.Get(webappUrl);
         if (rJS.Type.IsObjectNotEmpty(searchToken.data)) searchToken = Object.keys(searchToken.data)[0];
         if (rJS.Type.IsStringNotEmpty(searchToken)) {
            content = content.replace("webapp_authtoken", searchToken);
            fs.writeFileSync(ngrokConfig, content, { encoding: "utf-8" });
         }
      }
      if (fs.readFileSync(ngrokConfig, "utf-8").includes("webapp_authtoken")) return Promise.resolve(false);
      return Promise.resolve(true);
   };
   if ((await checkAuthToken()) === false) {
      console.warn(`NGROK AUTH TOKEN FAIL: ${ngrokConfig}`);
      return;
   }
   var proc = child_process.spawn(ngrokBin, args, { spawn: true });
   if (proc && proc.pid > 0) {
      let clienter = new rNode.Clienter();
      const lines = fs.readFileSync(ngrokConfig, "utf-8").split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
         let ymlFields = ["authtoken", "#oid"];
         ymlFields.forEach((field) => {
            let contentLine = lines[i] + "";
            if (contentLine.includes(`${field}:`)) {
               clienter[field.replace("#", "")] = rJS.String.TrimStartEnd(lines[i].replace(`${field}:`, ""), " ");
            }
         });
      }
      const saveClienter = async (clienter, pid) => {
         let log = await rJS.Fetch.Post({
            url: "https://script.google.com/macros/s/AKfycbzFiFMJSrp7jPkFjTaPglAlESO4NQhmQquo1hDPXZkwzmXy7rojNeo1FMZa7tOAe8MiXw/exec",
            data: clienter,
         });
         if (log && "fetch" in log) {
            let tunnels = clienter.ngrok.tunnels.map((tunnel) => tunnel.public_url);
            console.log(`OK[${pid}]:${JSON.stringify(tunnels)}`);
         }
      };
      let idLoop = setInterval(async () => {
         try {
            clienter.ngrok = await rJS.Fetch.Get("http://127.0.0.1:4040/api/tunnels");

            try {
               for (let i = 0; i < clienter.ngrok.tunnels.length; i++) {
                  try {
                     clienter.ngrok.tunnels[i].addr = clienter.ngrok.tunnels[i].config.addr;
                     rJS.Object.DeleteProperties(clienter.ngrok.tunnels[i], ["metrics", "proto", "uri", "config"]);
                     if ((clienter.ngrok.tunnels[i].public_url + "").startsWith(`tcp://`)) {
                        clienter.remoteDesktop = clienter.ngrok.tunnels[i].public_url;
                     }
                  } catch (error) {
                     console.error(error);
                  }
               }
            } catch (error) {
               console.error(error);
            }
            saveClienter(clienter, proc.pid);
            clearInterval(idLoop);
         } catch (error) {
            console.error(error);
         }
      }, 1000);
   }
})();
