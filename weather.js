const http = require("http");
const cityQuery = process.argv[2];
const fs = require("fs");
const getAPIKey = function(){
  if (fs.existsSync("./key.json")){
    return JSON.parse(fs.readFileSync("./key.json"));
  }
  else {
    return null;
  }
};
const apiKey = getAPIKey();

if (apiKey != null){
  //This object holds info about the request we are making
  const options = {
    hostname: "api.openweathermap.org",
    path: `/data/2.5/weather?q=${cityQuery}&APPID=${apiKey.key}`
  };

  //Here we make the actual request, usion the options we set
  var req = http.request(options, (res)=>{
    //This string hold the response
    var str = "";

    //THis function adds data chunks to our response str as it recievs them
    res.on("data", function(chunk){
      str += chunk;
    });

    //This function fires when our response is done, we can work with data now
    res.on("end", function(){
      let data = JSON.parse(str);
      //Default form openweathermap is Kelvin.
      //adjustedTemp converts the Farenheit
      //We could have added '&unit=imperial' to auto-convert on GET
      try{
        let adjustedTemp = ((data.main.temp * (9/5)) - 459.67).toFixed(2);
        console.log(`Temparature in ${data.name}: ${adjustedTemp}`);
      }
      catch(e){
        console.log(`${e.name}: ${e.message}. Is the API key in key.json valid?`);
      }

    });
  });
  req.end();
}else{
  throw new Error("No valid API key was found, aborting.");
}
