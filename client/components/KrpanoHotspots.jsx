import React, { useEffect, useState } from 'react';
import useKrpano from 'react-krpano-hooks'
import { _krapno } from '../middleware/CallKrpano';

function KrpanoHotspots() {
  // const {getKrpano} = useKrpano();
  const [loadScene, setLoadScene] = useState(false);
  useEffect(() => {
    // const krpano = document.querySelector('#react-krpano');
    // console.log(_krapno.containerRef);
    const hotspot = _krapno.getKrpano('xml.scene')
    _krapno.setKrpano('events.onloadcomplete', ()=> {
      setLoadScene(true)
    })

    function add_hotspot() {
      var h = _krapno.getKrpano("view.hlookat");
      var v = _krapno.getKrpano("view.vlookat");
      var hs_name = "hs" + ((Date.now() + Math.random()) | 0);	// create unique/randome name
      _krapno.callKrpano("addhotspot(" + hs_name + ")");
      _krapno.setKrpano("hotspot[" + hs_name + "].url", "%CURRENTXML%/skin/vtourskin_hotspot.png");
      _krapno.setKrpano("hotspot[" + hs_name + "].ath", h);
      _krapno.setKrpano("hotspot[" + hs_name + "].atv", v);
      _krapno.setKrpano("hotspot[" + hs_name + "].distorted", true);

      if (_krapno.getKrpano("device.html5")) {
        // for HTML5 it's possible to assign JS functions directly to krpano events
        _krapno.setKrpano("hotspot[" + hs_name + "].onclick", function (hs) {
          alert('hotspot "' + hs + '" clicked');

        }.bind(null, hs_name));
      }
      else {
        // for Flash the js() action need to be used to call from Flash to JS (this code would work for Flash and HTML5)
        _krapno.setKrpano("hotspot[" + hs_name + "].onclick", "js( alert(calc('hotspot \"' + name + '\" clicked')) );");
      }
    }
    // add_hotspot()

    console.log(hotspot)

  }, [])

  useEffect(()=> {
    if (loadScene) {
      console.log(_krapno.getKrpano('scene["scene_p1"]'));
      const hotspot = _krapno.getKrpano('hotspot["arrow_1"]');
      _krapno.setKrpano('scene["scene_p2"].onstart', ()=> {
        console.log("시작")
      })
    }
  }, [loadScene])
  return (
    <div id="tee">

    </div>
  );
}

export default KrpanoHotspots;