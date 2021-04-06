import { ad as androidUtils } from "tns-core-modules/utils/utils";
import { isAndroid } from "tns-core-modules/ui/core/view";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/internal/operators";
export class SoundPlayer {
    private clickSubject = new Subject();
    private aManager: android.media.AudioManager;
    constructor(){
        if(isAndroid){
            this.aManager = androidUtils
                .getApplicationContext()
                .getSystemService("audio") as android.media.AudioManager;            
        }

        this.clickSubject
            .pipe(throttleTime(80))
            .subscribe(() => this.doClick());

    }
    
    public click(){
        this.clickSubject.next();
    }

    private doClick() {
        if (isAndroid) {
            this.aManager.playSoundEffect(android.view.SoundEffectConstants.CLICK);
        }
    }
}
