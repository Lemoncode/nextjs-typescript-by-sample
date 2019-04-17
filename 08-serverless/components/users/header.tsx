const styles = require('./header.css');

export const Header = () => (
  <tr>
    <th className={styles.blueBox}>Avatar</th>
    <th className={styles.purpleBox}>Id</th>
    <th>Name</th>
  </tr>
);
