import React from 'react'

import Interact from "./widgets/components/Interact";
import RatingStars from "./widgets/components/RatingStars";
import SingleSelect from "./widgets/components/SingleSelect";
import Splash from "./widgets/components/Splash";
import Text from "./widgets/components/Text";
import Footer from "./widgets/components/Footer";
import Slider from "./widgets/components/Slider";
import MultiSelect from "./widgets/components/MultiSelect";
import Glossary from "./widgets/components/Glossary";
import Carousel from "./widgets/components/Carousel";
import DragAndDrop from './widgets/components/DragAndDrop/DragAndDrop';
import Connection from "./utils/connection";
import Ui from "./utils/ui";


export const widgetsProvider = function (connection: Connection, ui: Ui) {
  return {
    "cnv-essentials-sendtext": function (props) {
      return <Text {...props} connection={connection} ui={ui} />;
    },
    "cnv-essentials-interact": function (props) {
      return <Interact {...props} connection={connection} ui={ui} />;
    },
    "cnv-essentials-ratingstars": function (props) {
      return <RatingStars {...props} connection={connection} ui={ui} />;
    },
    "cnv-essentials-slider": function (props) {
      return <Slider {...props} connection={connection} ui={ui} />;
    },
    "cnv-essentials-singleselect": function (props) {
      return <SingleSelect {...props} connection={connection} ui={ui} />;
    },
    "cnv-essentials-multiselect": function (props) {
      return <MultiSelect {...props} connection={connection} ui={ui} />;
    },
    "cnv-essentials-splashscreen": function (props) {
      return <Splash {...props} connection={connection} ui={ui} />;
    },
    "cnv-essentials-footer": function (props) {
      return <Footer {...props} connection={connection} ui={ui} />;
    },
    glossary: function (props) {
      return <Glossary {...props} connection={connection} ui={ui} />;
    },
    "cnv-essentials-drag-and-drop": function (props) {
      return <DragAndDrop {...props} connection={connection} ui={ui} />
    },
    "cnv-essentials-carousel": function (props) {
      return <Carousel {...props} connection={connection} ui={ui} />;
    }
  }
};
