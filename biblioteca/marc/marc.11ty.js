// Registros MARC 21 de toda la Biblioteca Digital en tres formatos; se regeneran en cada compilación.
import { datosMarc, aIso2709, aMarcXml, aMrk } from "../../lib/marc.js";

const FORMATOS = {
  mrc: (rs) => rs.map(aIso2709).join(""),
  xml: (rs) => '<?xml version="1.0" encoding="UTF-8"?>\n<collection xmlns="http://www.loc.gov/MARC21/slim" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd">\n' + rs.map(aMarcXml).join("\n") + "\n</collection>\n",
  mrk: (rs) => rs.map(aMrk).join("\n\n") + "\n",
};

export default class {
  data() {
    return {
      pagination: { data: "marcFormatos", size: 1, alias: "formato" },
      marcFormatos: Object.keys(FORMATOS),
      permalink: (d) => `/biblioteca/marc/idearium-caribe.${d.formato}`,
      eleventyExcludeFromCollections: true,
    };
  }
  render(d) { return FORMATOS[d.formato](datosMarc(d)); }
}
