// https://docs.gitlab.com/ce/ci/variables/README.html

module.exports = {

  detect : function(){
    return !!process.env.GITLAB_CI;
  },

  configuration : function(){
    console.log('    Gitlab CI Detected');
    return {
      service : 'gitlab',
      build :  process.env.CI_BUILD_ID,
      commit : process.env.CI_BUILD_REF,
      branch : process.env.CI_BUILD_REF_NAME,
      root : process.env.CI_PROJECT_DIR,
      slug : process.env.CI_BUILD_REPO.split('/').slice(3, 5).join('/').replace('.git', '')
    };
  }

};
