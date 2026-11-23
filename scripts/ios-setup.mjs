// Prepares the iOS (Capacitor) project on a Mac. Safe to run again any time:
// creates ios/ on first run, then refreshes web assets, plugins, the
// Info.plist entries, the app icon and the launch screen.
//
//   npm run ios:setup     (then: npm run ios:open → Xcode)
//
// ios/ is generated rather than committed: its template carries binary
// images, and keeping it reproducible from this script means one source of
// truth for the bundle id, permissions and artwork.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run('npm run build');
if (!existsSync('ios/App')) {
  try {
    run('npx cap add ios --packagemanager SPM');
  } catch (err) {
    // With Swift Package Manager there is no Podfile, yet some CLI versions
    // still try `pod install` at the end of `cap add` and report a failure.
    // The project itself is already in place by then; `cap sync` below
    // finishes the job.
    if (!existsSync('ios/App/App.xcodeproj')) throw err;
  }
}
run('npx cap sync ios');

// Info.plist: camera/photo permission texts (letters are photographed or
// picked from the library) and the export-compliance answer (HTTPS only).
const plistPath = 'ios/App/App/Info.plist';
let plist = readFileSync(plistPath, 'utf8');
const entries = {
  NSCameraUsageDescription:
    '<string>Brifo uses the camera to photograph your letters so they can be read and explained.</string>',
  NSPhotoLibraryUsageDescription:
    '<string>Brifo lets you pick a photo of a letter from your library so it can be read and explained.</string>',
  ITSAppUsesNonExemptEncryption: '<false/>',
};
for (const [key, value] of Object.entries(entries)) {
  if (plist.includes(`<key>${key}</key>`)) continue;
  const at = plist.lastIndexOf('</dict>');
  plist = `${plist.slice(0, at)}\t<key>${key}</key>\n\t${value}\n${plist.slice(at)}`;
}
writeFileSync(plistPath, plist);

// iPhone only. Brifo's layout is built for a phone; as a universal app App
// Store Connect also demands 13-inch iPad screenshots and review would judge
// the phone layout stretched across an iPad. An iPhone-only app still runs on
// iPads in compatibility mode.
const pbxPath = 'ios/App/App.xcodeproj/project.pbxproj';
const pbx = readFileSync(pbxPath, 'utf8');
writeFileSync(pbxPath, pbx.replace(/TARGETED_DEVICE_FAMILY = "?1,2"?;/g, 'TARGETED_DEVICE_FAMILY = 1;'));

// App icon (1024 px, no alpha channel — App Store rejects transparency) and
// the launch screen, both rendered from SVG so no binaries live in the repo.
const sharp = 'npx --yes sharp-cli@5';
const assets = 'ios/App/App/Assets.xcassets';
run(`${sharp} -i public/icons/icon.svg -o ${assets}/AppIcon.appiconset/AppIcon-512@2x.png resize 1024 1024 -- removeAlpha`);
for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
  run(`${sharp} -i resources/ios-splash.svg -o ${assets}/Splash.imageset/${name} resize 2732 2732 -- removeAlpha`);
}

console.log('\n✅ iOS project ready. Next: npm run ios:open');
