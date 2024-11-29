# Skillset Modpack
Welcome to the Skillset modpack, a collection of single player tarkov mods originally collected by SirSkillz and formalized into a git repo for easy source control by TurkeyKittin

You should be able to git pull this into your root SPT folder and everything should work.

Note, you may occasionally need to re-enter your username into the Launcher. Don't worry, your profile isn't lost! If you forgot what name you used, look in `SPT/user/profiles/<sequence_of_characters>.json`. At the very top of the .json file you will find your username. Just enter that into the launcher and you're good to go.

```
{
	"info": {
		"id": "6749234a0001ff3be2cba740",
		"scavId": "6749234a000188fcb468102e",
		"aid": 1131996,
		"username": "your_username_here", <----------This right here
		"password": "",
		"wipe": false,
		"edition": "Unheard"
	},
```

# Updating the pack
If you need to update the pack, it should be as easy as following the steps below:
1. Open your SPT folder
2. Right click in an open space within the folder, and click `Open Git Bash Here`. If the option is not visible, you may need to click `Show More Options` first.
3. With the terminal open, simply type `git pull` and press enter. Let it finish, and that's it!