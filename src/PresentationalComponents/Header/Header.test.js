import React from 'react';
import Header from './Header';
import { mountWithRouter } from '../../../config/rtlwrapper';

describe('Header component', () => {
  it('should render with header as empty string', () => {
    const header = { title: '' };
    const { asFragment } = mountWithRouter(<Header {...header} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with header Hello world', () => {
    const header = { title: 'Hello world' };
    const { asFragment } = mountWithRouter(<Header {...header} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with empty breadcrumb', () => {
    const header = {
      breadcrumbs: [],
      title: '',
    };
    const { asFragment } = mountWithRouter(<Header {...header} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with 1 breadcrumb item and last is active', () => {
    const header = {
      title: '',
      breadcrumbs: [
        {
          title: 'First item',
          to: '#',
          isActive: true,
        },
      ],
    };
    const { asFragment } = mountWithRouter(<Header {...header} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render without to attribute', () => {
    const header = {
      title: '',
      breadcrumbs: [
        {
          title: 'First item',
          isActive: true,
        },
      ],
    };
    const { asFragment } = mountWithRouter(<Header {...header} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with 2 breadcrumb items and last is active', () => {
    const header = {
      title: '',
      breadcrumbs: [
        {
          title: 'First item',
          to: '#',
          isActive: false,
        },
        {
          title: 'Second item',
          to: '#',
          isActive: true,
        },
      ],
    };
    const { asFragment } = mountWithRouter(<Header {...header} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with 3 breadcrumb items and last is active', () => {
    const header = {
      title: '',
      breadcrumbs: [
        {
          title: 'First item',
          to: '#',
          isActive: false,
        },
        {
          title: 'Second item',
          to: '#',
          isActive: false,
        },
        {
          title: 'Third item',
          to: '#',
          isActive: true,
        },
      ],
    };
    const { asFragment } = mountWithRouter(<Header {...header} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
