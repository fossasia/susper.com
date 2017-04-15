
var detect = require("../lib/detect");
var execSync = require('child_process').execSync;
if (!execSync) {
  var exec = require('execSync').exec;
  var execSync = function(cmd){
    return exec(cmd).stdout;
  };
}

describe("Codecov", function(){

  it("can detect existing appveyor service", function(){
    process.env.TRAVIS = "true";

    expect(detect().service).to.eql("travis");

    process.env.TRAVIS = "";
  });

  it("can select local git service if no service is found", function(){
    expect(detect().commit).to.match(/^\w{40}$/);
    expect(detect().commit).to.eql(execSync("git rev-parse HEAD || hg id -i --debug | tr -d '+'").toString().trim());
  });

});
