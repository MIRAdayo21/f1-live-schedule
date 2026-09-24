const grandprixGrid = document.querySelector(".grandprix-grid");
const displaySessionStatus = document.querySelector(".display-session-status");
const displaySessionName = document.querySelector(".display-session-name");
const displaySessionTime = document.querySelector(".display-session-time");
const displaySessionDetail = document.querySelector(".display-session-detail");

const grandPrixDetails = [
  {
    grandPrix: "アゼルバイジャンGP",
    flag: "🇦🇿",
    circuit: "バクー・シティ・サーキット",
  },
  {
    grandPrix: "バーレーンGP in マレーシア",
    flag: "🇧🇭",
    circuit: "セパン・インターナショナル・サーキット",
  },
];

const sessions = [
  {
    id: "2026-azerbaijan-fp1",
    grandPrix: "アゼルバイジャンGP",
    sessionName: "フリー走行1",
    startAt: "2026-09-24T17:30:00+09:00",
    endAt: "2026-09-24T18:30:00+09:00",
  },
  {
    id: "2026-azerbaijan-fp2",
    grandPrix: "アゼルバイジャンGP",
    sessionName: "フリー走行2",
    startAt: "2026-09-24T21:00:00+09:00",
    endAt: "2026-09-24T22:00:00+09:00",
  },
  {
    id: "2026-azerbaijan-fp3",
    grandPrix: "アゼルバイジャンGP",
    sessionName: "フリー走行3",
    startAt: "2026-09-25T17:30:00+09:00",
    endAt: "2026-09-25T18:30:00+09:00",
  },
  {
    id: "2026-azerbaijan-qualifying",
    grandPrix: "アゼルバイジャンGP",
    sessionName: "予選",
    startAt: "2026-09-25T21:00:00+09:00",
    endAt: "2026-09-25T22:00:00+09:00",
  },
  {
    id: "2026-azerbaijan-race",
    grandPrix: "アゼルバイジャンGP",
    sessionName: "決勝",
    startAt: "2026-09-26T20:00:00+09:00",
    endAt: "2026-09-26T22:00:00+09:00",
  },
  {
    id: "2026-bahrain-fp1",
    grandPrix: "バーレーンGP in マレーシア",
    sessionName: "フリー走行1",
    startAt: "2026-10-02T13:30:00+09:00",
    endAt: "2026-10-02T14:30:00+09:00",
  },
  {
    id: "2026-bahrain-fp2",
    grandPrix: "バーレーンGP in マレーシア",
    sessionName: "フリー走行2",
    startAt: "2026-10-02T17:00:00+09:00",
    endAt: "2026-10-02T18:00:00+09:00",
  },
  {
    id: "2026-bahrain-fp3",
    grandPrix: "バーレーンGP in マレーシア",
    sessionName: "フリー走行3",
    startAt: "2026-10-03T13:30:00+09:00",
    endAt: "2026-10-03T14:30:00+09:00",
  },
  {
    id: "2026-bahrain-qualifying",
    grandPrix: "バーレーンGP in マレーシア",
    sessionName: "予選",
    startAt: "2026-10-03T17:00:00+09:00",
    endAt: "2026-10-03T18:00:00+09:00",
  },
  {
    id: "2026-bahrain-race",
    grandPrix: "バーレーンGP in マレーシア",
    sessionName: "決勝",
    startAt: "2026-10-04T16:00:00+09:00",
    endAt: "2026-10-04T18:00:00+09:00",
  },
];

function formatSessionDate(startAt) {
  return new Date(startAt).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

function formatSessionTime(startAt) {
  return new Date(startAt).toLocaleTimeString("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

function createGrandPrixPeriod(sessionList) {
  const firstSession = sessionList[0];
  const lastSession = sessionList[sessionList.length - 1];

  return `${formatSessionDate(firstSession.startAt)}〜${formatSessionDate(lastSession.startAt)}`;
}

function findDisplaySession(sessionList, now) {
  let nextSession = null;
  let nextStartDate = null;

  for (const session of sessionList) {
    const startDate = new Date(session.startAt);
    const endDate = new Date(session.endAt);

    if (startDate <= now && now < endDate) {
      return {
        state: "current",
        session,
      };
    }

    if (
      startDate > now &&
      (nextStartDate === null || startDate < nextStartDate)
    ) {
      nextSession = session;
      nextStartDate = startDate;
    }
  }

  if (nextSession !== null) {
    return {
      state: "upcoming",
      session: nextSession,
    };
  }

  return {
    state: "finished",
    session: null,
  };
}

function createCountdownText(startAt, now) {
  const startDate = new Date(startAt);
  const totalSeconds = Math.max(0, Math.ceil((startDate - now) / 1000));
  const days = Math.floor(totalSeconds / 60 / 60 / 24);
  const hours = Math.floor((totalSeconds / 60 / 60) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const seconds = totalSeconds % 60;

  return `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
}

function renderDisplaySession(result, now) {
  if (result.state === "finished") {
    displaySessionStatus.textContent = "全日程終了";
    displaySessionName.textContent = "";
    displaySessionTime.textContent = "";
    displaySessionTime.removeAttribute("datetime");
    displaySessionDetail.textContent = "";
    return;
  }

  const session = result.session;
  const startText = `${formatSessionDate(session.startAt)} ${formatSessionTime(session.startAt)} JST`;

  displaySessionName.textContent = `${session.grandPrix} ${session.sessionName}`;
  displaySessionTime.dateTime = session.startAt;
  displaySessionTime.textContent = `開始予定 ${startText}`;

  if (result.state === "current") {
    const endText = `${formatSessionDate(session.endAt)} ${formatSessionTime(session.endAt)} JST`;

    displaySessionStatus.textContent = "LIVE（予定時刻基準）";
    displaySessionDetail.textContent = `終了予定 ${endText}`;
    return;
  }

  displaySessionStatus.textContent = "次のセッション";
  displaySessionDetail.textContent = `開始まで ${createCountdownText(session.startAt, now)}`;
}

let displaySessionResult;

function updateDisplaySession() {
  const now = new Date();

  displaySessionResult = findDisplaySession(sessions, now);
  renderDisplaySession(displaySessionResult, now);
}

updateDisplaySession();
setInterval(updateDisplaySession, 1000);

function toggleCard(card, toggleButton) {
  const isOpen = card.classList.toggle("open");
  const toggleLabel = toggleButton.querySelector(".toggle-label");

  toggleButton.setAttribute("aria-expanded", String(isOpen));
  toggleLabel.textContent = isOpen ? "日程を閉じる" : "日程を見る";
}

grandPrixDetails.forEach((grandPrixDetail, index) => {
  const card = document.createElement("article");
  const grandPrixSessions = sessions.filter((session) => {
    return session.grandPrix === grandPrixDetail.grandPrix;
  });
  const sessionListId = `session-list-${index + 1}`;
  const grandPrixPeriod = createGrandPrixPeriod(grandPrixSessions);

  card.classList.add("grandprix-card");

  const sessionItems = grandPrixSessions
    .map((session) => {
      const dateText = formatSessionDate(session.startAt);
      const timeText = formatSessionTime(session.startAt);

      return `
        <li>
          <span>${session.sessionName}</span>
          <time datetime="${session.startAt}">${dateText}</time>
          <time datetime="${session.startAt}">${timeText} JST</time>
        </li>
      `;
    })
    .join("");

  card.innerHTML = `
    <h3 class="grandprix-title">
      <button
        class="grandprix-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="${sessionListId}"
      >
        <span class="grandprix-heading">
          <span>${grandPrixDetail.flag} ${grandPrixDetail.grandPrix}</span>
          <span class="grandprix-action">
            <span class="toggle-label">日程を見る</span>
            <span class="toggle-icon" aria-hidden="true">▼</span>
          </span>
        </span>
        <span class="grandprix-period">開催期間 ${grandPrixPeriod}</span>
        <span class="circuit-name">${grandPrixDetail.circuit}</span>
      </button>
    </h3>
    <ul class="session-list" id="${sessionListId}">
      ${sessionItems}
    </ul>
  `;

  const toggleButton = card.querySelector(".grandprix-toggle");

  toggleButton.addEventListener("click", () => {
    toggleCard(card, toggleButton);
  });

  grandprixGrid.appendChild(card);
});
