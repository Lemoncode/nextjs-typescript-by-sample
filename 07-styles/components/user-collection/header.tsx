import * as React from 'react';

const classNames = require('./header.css');

export const UserHeader = () =>
    <tr>
        <th>
            <div className={classNames.bluebox}>
                Avatar
            </div>
        </th>
        <th>
            <div className={classNames['purple-box']}>
                Id
            </div>
        </th>
        <th>
            Name
        </th>
    </tr>