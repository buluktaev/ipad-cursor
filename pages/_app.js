import React from 'react';
import App from 'next/app';
import Providers from '../components/Providers.js';

export default class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      active: true
    }
  }

  render () {
    const { Component, pageProps } = this.props;
    return (
      <Providers showingCursor={this.state.active}>
        <Component {...pageProps} toggleCursor={() => this.setState({active: !this.state.active})} />
      </Providers>
    )
  }
}