module.exports = {
  test: (val: unknown) => typeof val === "string",
  serialize: (val: string) => {

    let newVal = val.replace('"', '');

    newVal = val.replace(
      /([A-Fa-f0-9]{32}|[A-Fa-f0-9]{64})(\.zip)/,
      '[HASH REMOVED].zip');

    newVal = newVal.replace(
      /-\d{14}$|-\d{14}$/,
      '-[TIMESTAMP REMOVED]'
    );

    return `"${newVal}"`;

  },
}