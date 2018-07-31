import * as React from 'react';
import Link from 'next/link';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';

import { UserEntity } from 'model/user';

interface Props {
    user: UserEntity;
}

export const UserCard = (props: Props) =>
    <div>
        <Card>
            <CardMedia style={{ height: 0, paddingTop: '56.25%' }}
                image={props.user.avatar_url} />
            <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    {props.user.login}
                </Typography>
                <Typography component="p">
                    Id: {props.user.id}
                </Typography>
            </CardContent>
            <CardActions>
                <Link as={`user-info/id/${props.user.login}`} href={`/user-info?id=${props.user.login}`}>
                    <Button size="small" color="primary">
                        User info
                    </Button>
                </Link>
            </CardActions>
        </Card>
    </div>