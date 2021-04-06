// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';

import {
    exitEvent,
    launchEvent,
    lowMemoryEvent,
    resumeEvent,
    suspendEvent,
    uncaughtErrorEvent,
    ApplicationEventData,
    LaunchEventData,
    on as applicationOn,
    AndroidApplication,
    AndroidActivityBackPressedEventData,
    android
} from 'tns-core-modules/application';

import { AppState } from './app/shared/models/app-state';
import { MessagingService } from './app/core/services/messaging.service';
import { AppEvents } from './app/shared/constants';
import { UnlockService } from '~/app/core/services/unlock.service';
import { traceDebug, traceError } from '~/app/core/logging/logging-utils';
import { androidLaunchEventLocalizationHandler } from 'nativescript-localize/localize';

applicationOn(launchEvent, (args: LaunchEventData) => {
    if (args.android) {
        // For Android applications, args.android is an android.content.Intent class.
        traceDebug('Launched Android application with the following intent: ' + args.android + '.');

        traceDebug('[LaunchEvent] Android has launched localization event handler');
        androidLaunchEventLocalizationHandler();

        if (MessagingService.instance) {
            MessagingService.instance.setState(AppEvents.AppState, AppState.LAUNCHED);
        }
    } else if (args.ios !== undefined) {
        // For iOS applications, args.ios is NSDictionary (launchOptions).
        traceDebug('Launched iOS application with options: ' + args.ios);
    }
});

applicationOn(suspendEvent, (args: ApplicationEventData) => {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        traceDebug('[SUSPENDED] Activity: ' + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        traceDebug('[SUSPENDED] UIApplication: ' + args.ios);
    }
    if (UnlockService.instance) {
        UnlockService.instance.suspend();
    }
    if (MessagingService.instance) {
        MessagingService.instance.setState(AppEvents.AppState, AppState.SUSPENDED);
    }
});

applicationOn(resumeEvent, (args: ApplicationEventData) => {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        traceDebug('[RESUMED] Activity: ' + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        traceDebug('[RESUMED] UIApplication: ' + args.ios);
    }
    if (UnlockService.instance) {
        UnlockService.instance.resume();
    }
    if (MessagingService.instance) {
        MessagingService.instance.setState(AppEvents.AppState, AppState.RESUMED);
    }
});

applicationOn(exitEvent, (args: ApplicationEventData) => {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        traceDebug('Activity: ' + args.android);
        if (args.android.isFinishing()) {
            traceDebug('Activity: ' + args.android + ' is exiting');
        } else {
            traceDebug('Activity: ' + args.android + ' is restarting');
        }
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        traceDebug('UIApplication: ' + args.ios);
    }
});

applicationOn(lowMemoryEvent, (args: ApplicationEventData) => {
    if (args.android) {
        // For Android applications, args.android is an android activity class.
        traceDebug('Activity: ' + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        traceDebug('UIApplication: ' + args.ios);
    }
});

applicationOn(uncaughtErrorEvent, (args: ApplicationEventData) => {
    if (args.android) {
        // For Android applications, args.android is an NativeScriptError.
        traceError('NativeScriptError: ' + args.android);
    } else if (args.ios) {
        // For iOS applications, args.ios is NativeScriptError.
        traceError('NativeScriptError: ' + args.ios);
    }
});

if (android) {
    android.on(AndroidApplication.activityBackPressedEvent, (args: AndroidActivityBackPressedEventData) => {
        if (UnlockService.instance && UnlockService.instance.isLocked) {
            traceDebug('[Main] Back Button suppressed');
            args.cancel = true;
        }
    });
}
platformNativeScriptDynamic().bootstrapModule(AppModule);
