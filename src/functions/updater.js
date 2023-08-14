const simpleGit = require('simple-git');
const path = require('path');
const { yellow, green, red } = require('colorette')
const localRepoPath = path.join(__dirname, '..');
const git = simpleGit(localRepoPath);

const checkForUpdates = async () => {
  try {
    console.log(`${yellow("[UPDATER]")} Checking for updates...`)
    await git.fetch();

    const localHash = await git.revparse('HEAD');
    const remoteHash = await git.revparse(`main@{upstream}`);

    if (localHash !== remoteHash) {
      console.log(`${green("[UPDATER]")} New update available. Initiating update...`);
      await git.pull();
      console.log(`${green("[UPDATER]")} Update completed!`);
    } else {
      console.log(`${yellow("[UPDATER]")} No updates available.`);
    }
  } catch (error) {
    console.error(`${red("[UPDATER]")} Error checking for updates:`, error);
  }
};
module.exports = checkForUpdates;