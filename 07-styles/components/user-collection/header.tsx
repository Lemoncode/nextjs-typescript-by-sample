import * as React from 'react';

const classNames = require('./header.css');

export const UserHeader = () =>
    <tr className={classNames.header}>
        <th>
            Avatar
        </th>
        <th>
            Id
        </th>
        <th>
            Name
        </th>
    </tr>