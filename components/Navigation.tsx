import Link from 'next/link';
import React, {useState} from 'react';
import {useStore} from '../util/store';
import {Route} from '../util/routes';
import {useRouter} from 'next/router';
import FeatherIcon from 'feather-icons-react';
import {Notification} from './Notifications';
import OutsideClickHandler from 'react-outside-click-handler';

export function Navigation() {
  const [isLoggedIn, messages] = useStore(state => [state.isLoggedIn(), state.messages, state.loading]);
  const unreadMessages = messages.filter(m => m.unread);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="p-4 bg-white flex items-end justify-between">
      <Link href="/">
        <div className="text-2xl font-serif font-bold cursor-pointer">
          gntmhub
        </div>
      </Link>
      {isLoggedIn ? <div className="flex flex-col md:flex-row">
        <Link href={Route.TRADE}>
          <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
            Handel
          </div>
        </Link>
        <Link href={Route.QUESTION}>
          <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
            Fragen
          </div>
        </Link>
        <Link href={Route.LEADERBOARD}>
          <div className="text-md cursor-pointer px-1 md:px-4 uppercase">
            Rangliste
          </div>
        </Link>
        <div className="text-md px-1 md:px-4 relative">
          <div className="cursor-pointer" onClick={() => setNotificationOpen(x => !x)}>
            <FeatherIcon icon="bell" size="20"/>
          </div>
          {unreadMessages.length > 0 && notificationOpen ?
            <OutsideClickHandler onOutsideClick={() => setNotificationOpen(false)}>
              <div className="bg-white absolute z-20 top-full right-0 w-64 rounded shadow-2xl transform translate-y-4 overflow-y-auto">
                {unreadMessages.map(notification => <Notification notification={notification} short={true}/>)}
              </div>
            </OutsideClickHandler> : null}
          {unreadMessages.length == 0 && notificationOpen ?
            <OutsideClickHandler onOutsideClick={() => setNotificationOpen(false)}>
              <div
                className="bg-white absolute z-20 top-full right-0 w-64 h-32 flex flex-col justify-center items-center rounded shadow-2xl transform translate-y-4">
                <div className="text-lg flex"> Keine Neuigkeiten.</div>
                <Link href={Route.NOTIFICATIONS}>
                  <div className="text-sm px-1 border border-gray-400 text-gray-400 rounded mt-2 cursor-pointer">
                    Benachrichtigungen ansehen
                  </div>
                </Link>
              </div>
            </OutsideClickHandler> : null}
        </div>
      </div> : null}
    </div>
  );
}
