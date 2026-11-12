/** What fills the screen while the app works out who you are.
 *
 * Before this there was nothing: the bundle parses, AuthContext asks Supabase
 * whether there is a session, and until that answers the page is simply the
 * background colour. On a slow connection that blank sits there long enough to
 * read as a fault — and a blank screen is exactly what a parent already
 * reported once.
 *
 * So this is not decoration: it is the honest statement that the app is
 * working. It shows for as long as that check really takes and no longer, with
 * no artificial delay. On a fast phone it is a blink; on a slow one it is the
 * difference between "loading" and "broken".
 *
 * It deliberately carries no text. The name is in the lockup, and any sentence
 * here would have to be translated six ways to say what the spinner already
 * says.
 */
import { BrifoWordmark } from './BrifoWordmark';
import './SplashScreen.css';

export function SplashScreen() {
  return (
    <div className="splash" role="status" aria-busy="true" aria-label="Brifo">
      <BrifoWordmark height={52} />
      <div className="splash-spinner" />
    </div>
  );
}
