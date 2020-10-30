import React, { Fragment } from 'react';
import { Box, Heading } from 'rebass';
import { UrlObject } from 'url';
import Clickable from './clickable';
import type { Url } from '../../@types';

const Card = ({
    title,
    active,
    children,
    onClick,
    href,
    clickable = true,
    className,
    ...rest
}: {
    title?: string;
    active?: boolean;
    href?: Url;
    onClick?: () => void;
    children?: React.ReactNode;
    clickable?: boolean;
    className?: string;
}) => {
    let activeStyle = {};
    if (clickable) {
        activeStyle = {
            borderWidth: '3px',
            borderColor: 'primary',
        };
    }
    const style = {
        borderRadius: '7px',
        borderWidth: '1px',
        borderColor: 'grey',
        borderStyle: 'solid',
        boxShadow: '-4px 4px 50px -12px rgb(185 185 185 / 56%)',
        '&:active': {
            ...activeStyle,
        },
    };
    return (
        <Clickable href={href} onClick={onClick} className={className}>
            <Box p={3} mx={2} my={2} sx={active ? { ...style, ...activeStyle } : style} bg='white'>
                {!!title && (
                    <Heading my={2} color='primary' fontWeight='bold' fontSize={[4, 3]}>
                        {title}
                    </Heading>
                )}
                {children}
            </Box>
        </Clickable>
    );
};

export default Card;