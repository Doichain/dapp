import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import {isDebug} from "../../../startup/server/dapp-configuration";

const PLACEHOLDER_REGEX = /\${([\w]*)}/g
const ParseTemplateSchema = new SimpleSchema({
  template: {
    type: String,
  },
  data: {
    type: Object,
    blackbox: true
  }
});

const parseTemplate = (data) => {
  try {
    const ourData = data;
      if(isDebug()) { console.log("parseTemplate:\n"+ourData);}
    ParseTemplateSchema.validate(ourData);
    if(isDebug()) { console.log("ParseTemplateSchema validated");}

    var matches;
    var template = ourData.template;
      if(isDebug()) { console.log("doing some regex with template:\n"+template);}
    do {
      _match = PLACEHOLDER_REGEX.exec(template);
      if(_match) template = _replacePlaceholder(template, _match, ourData.data[_match[1]]);
    } while (_match);
    return template;
  } catch (exception) {
    throw new Meteor.Error('emails.parseTemplate.exception', exception);
  }
};

function _replacePlaceholder(template, _match, replace) {
  var rep = replace;
  if(replace === undefined) rep = "";
  return template.substring(0, _match.index)+rep+template.substring(_match.index+_match[0].length);
}

export default parseTemplate;
