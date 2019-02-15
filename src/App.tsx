import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Input} from "nav-frontend-skjema";
import {Sidetittel} from "nav-frontend-typografi";
import Veilederpanel from 'nav-frontend-veilederpanel';
import Veileder from 'nav-frontend-veileder';
import navkopp from './navkopp.png';
import PanelBase from 'nav-frontend-paneler';
import { Select } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';




class App extends Component {
  render() {
    return (

        <div className = "forside">
            <PanelBase className = "overpanel">
                <Select className = "menu1" label=''>
                    <option value=''>Language</option>
                    <option value='norge'>Norge</option>
                    <option value='sverige'>Sverige</option>
                    <option value='danmark'>Danmark</option>
                </Select>
                <Select className="menu2" label='Høykontrast'>
                    <option value=''>Velg land</option>
                    <option value='norge'>Norge</option>
                    <option value='sverige'>Sverige</option>
                    <option value='danmark'>Danmark</option>
                </Select>
                <Select className="menu3" label='Skriftstørrelse'>
                    <option value=''>Velg land</option>
                    <option value='norge'>Norge</option>
                    <option value='sverige'>Sverige</option>
                    <option value='danmark'>Danmark</option>
                </Select>
            </PanelBase>
          <Sidetittel>Ditt NAV for arbeidsgivere</Sidetittel>
        <Input label=' ID '/>
          <Input label=' Passord '/>
        </div>






    );
  }
}

export default App;
