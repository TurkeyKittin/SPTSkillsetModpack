This is a crude attempt to reimplement Borkel's Big Realistic Thermal Package from scratch to 3.10.

Updated to real-life resolutions (pixelated effect value is taken from vertical resolution instead of horizontal like Borkel did), refresh rates and adjusted HARD thermal cut off range from 250m to 1000m (but there is still natural BSG depth thermal fade that wasn't touched). Left all other BSG effects as-is. 

Changes:
- flir rs32: 21 Hz -> 60 Hz and 172px -> 240px resolution. 
- sig sauer echo1: 10 Hz/21 Hz -> 30 Hz and 172px -> 156px resolution (this is a nerf)
- torrey pines logic t12w: 10 Hz -> 30 Hz, 30px -> 60px resolution
- armasight zeus pro: 21 Hz -> 30 Hz, 172px -> 512px resolution
- trijicon reap-ir: now has two zoom modes - 1.2x and 9.6x zooms, only black pallete, 35 Hz -> 60 Hz, 228 -> 480px resolution
- mp155 kalashnikov ultima camera thermal: 15 Hz -> 30 Hz, 135px -> 240px resolution

Used AssetBundleExtractor 3.0beta1 to adjust ScopeThermalVisionData and ScopeCameraData directly. 
