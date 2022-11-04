import { isString } from '@itsumono/utils'
import { Anchor, AnchorProps, Button, ButtonProps } from '@mantine/core'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import type { RC } from '@itsumono/react'

type LinkHref = string | URL

export const InBoundLink: RC.WithChildren<NextLinkProps> = ({ children, prefetch = false, ...props }) => {
  return (
    <NextLink prefetch={prefetch} {...props}>
      {children}
    </NextLink>
  )
}

export const InBoundButtonLink: RC.WithChildren<Omit<NextLinkProps, 'passHref' | 'legacyBehavior'> & ButtonProps> = ({
  children,
  href,
  prefetch = false,
  as,
  replace,
  scroll,
  shallow,
  locale,
  ...buttonProps
}) => {
  return (
    <InBoundLink
      href={href}
      prefetch={prefetch}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      locale={locale}
      legacyBehavior
      passHref
    >
      <Button component='a' {...buttonProps}>
        {children}
      </Button>
    </InBoundLink>
  )
}

export const OutBoundLink: RC.WithChildren<{ href: LinkHref } & AnchorProps> = ({ children, href, ...props }) => {
  return (
    <Anchor rel='noopener nofollow' target='_blank' href={isString(href) ? href : href.toString()} {...props}>
      {children}
    </Anchor>
  )
}

export const OutBoundButtonLink: RC.WithChildren<{ href: LinkHref } & ButtonProps> = ({ children, href, ...props }) => {
  return (
    <Button
      component='a'
      rel='noopener nofollow'
      target='_blank'
      href={isString(href) ? href : href.toString()}
      {...props}
    >
      {children}
    </Button>
  )
}
