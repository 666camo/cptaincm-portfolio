interface ActivitySource {
  id: 'github' | 'wakatime';
  name: string;
  state: 'not-connected' | 'no-data';
  detail: string;
}

export const activity: ActivitySource[] = [
  { id: 'github', name: 'GitHub', state: 'not-connected', detail: 'Contribution activity is currently unavailable.' },
  { id: 'wakatime', name: 'WakaTime', state: 'not-connected', detail: 'Coding time is currently unavailable.' },
];
