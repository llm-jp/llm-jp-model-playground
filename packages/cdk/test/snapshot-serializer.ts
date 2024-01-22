module.exports = {
  test: (val: unknown) => typeof val === "string",
  print: (val: string) => {
    const isHashValue = /^[A-Fa-f0-9]{32}$|^[A-Fa-f0-9]{64}$/;


    let newVal = val.replace(
      /([A-Fa-f0-9]{32}|[A-Fa-f0-9]{64})(\.zip)/,
      '[HASH REMOVED].zip');

    newVal = newVal.replace(
      /-\d{14}$|-\d{14}$/,
      '-[TIMESTAMP REMOVED]'
    );


    return `"${newVal}"`;

  },
};