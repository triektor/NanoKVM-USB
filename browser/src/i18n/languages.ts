const languages = [
  { key: 'en', name: 'English' },
  { key: 'zh', name: '中文' }
];

languages.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

export default languages;
