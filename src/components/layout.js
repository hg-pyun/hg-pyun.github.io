import React from 'react';
import { Link } from 'gatsby';
import { Icon } from '@iconify/react';
import githubFill from '@iconify/icons-ant-design/github-fill';
import linkedinFill from '@iconify/icons-ant-design/linkedin-fill';

import { rhythm, scale } from '../utils/typography';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    let header;

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      );
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      );
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        <footer
          style={{
            textAlign: 'right',
          }}
        >
          <Icon
            icon={githubFill}
            width={40}
            height={40}
            style={{ cursor: 'pointer' }}
            onClick={() => window.open('https://github.com/hg-pyun')}
          />
          {` `}
          <Icon
            icon={linkedinFill}
            width={40}
            height={40}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              window.open('https://www.linkedin.com/in/haegul-pyun-747977122/')
            }
          />
        </footer>
      </div>
    );
  }
}

export default Layout;
