import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';

import Badge from './components/Badge';
import { GlobalState } from '~/core/src/store/types';
import { setBadgeCount } from '~/core/src/store/actions';

import './style.scss';

const openLauncher = require('../../../../../assets/launcher_button.svg') as string;
const close = require('../../../../../assets/clear-button.svg') as string;

type Props = {
  toggle: () => void;
  chatId: string;
  openLabel: string;
  closeLabel: string;
}

function Launcher({ toggle, chatId, openLabel, closeLabel }: Props) {
  const dispatch = useDispatch();
  const { showChat, badgeCount } = useSelector((state: GlobalState) => ({
    showChat: state.behavior.showChat,
    badgeCount: state.messages.badgeCount
  }));

  const toggleChat = () => {
    toggle();
    if (!showChat) dispatch(setBadgeCount(0));
    var showcaseElement = document.getElementById("showcase");

    if (showcaseElement?.style.pointerEvents === "none") {
      showcaseElement.style.pointerEvents = "auto";
    } else if (showcaseElement) {
      showcaseElement.style.pointerEvents = "none";
    }
  }

  return (
    <button type="button" className={cn('rcw-launcher', { 'rcw-hide-sm': showChat })} onClick={toggleChat} aria-controls={chatId}>
      {!showChat && <Badge badge={badgeCount} />}
      {showChat ?
        <img src={close} className="rcw-close-launcher" alt={openLabel} /> :
        <img src={openLauncher} className="rcw-open-launcher" alt={closeLabel} />
      }
    </button>
  );
}

export default Launcher;
