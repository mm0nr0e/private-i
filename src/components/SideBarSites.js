import React, { Component } from 'react';
import { HashRouter, Link, Switch, Route } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ActionDashboard from 'material-ui/svg-icons/action/dashboard.js';
import FileFolder from 'material-ui/svg-icons/file/folder.js';

////////// Similar to Header.js but for Dashboard feature //////////
class SideBarSites extends Component {
  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  // handletoggle = () => this.setState({open: !this.state.open });


  render() {
    return(
      <div>
        <Drawer docked={true}>
          <Link to='/dashboard'><MenuItem leftIcon={<ActionDashboard />}>Dashboard</MenuItem></Link>
          <Link to='/dashboard/sites/pages'><MenuItem leftIcon={<FileFolder />}>Pages</MenuItem></Link>
          <Link to='/dashboard/settings'><MenuItem leftIcon={<FileFolder />}>Settings</MenuItem></Link>
        </Drawer>
      </div>
    )
  }
}

export default SideBarSites;