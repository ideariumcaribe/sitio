<?xml version="1.0" encoding="UTF-8"?>
<!-- Presentación legible de las respuestas OAI-PMH en el navegador. Los cosechadores reciben el XML sin cambios. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:oai="http://www.openarchives.org/OAI/2.0/"
  xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:marc="http://www.loc.gov/MARC21/slim"
  exclude-result-prefixes="oai oai_dc dc marc">
  <xsl:output method="html" encoding="UTF-8" indent="no"/>
  <xsl:variable name="base">/oai</xsl:variable>

  <xsl:template match="/">
    <html lang="es">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>OAI-PMH · Biblioteca Digital de Idearium Caribe</title>
        <style>
          body{margin:0;background:#fbfaf7;color:#1a1a1a;font:17px/1.55 Georgia,"Times New Roman",serif}
          .wrap{max-width:900px;margin:0 auto;padding:28px 16px 60px}
          a{color:#1a1a1a}
          h1{font-weight:400;font-size:1.7rem;margin:.2em 0 .4em}
          h2{font-weight:400;font-size:1.25rem;margin:1.6em 0 .5em}
          .label{font:600 .72rem/1.2 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#555}
          nav.verbos{display:flex;flex-wrap:wrap;gap:6px 18px;margin:14px 0 6px;font:.85rem system-ui,sans-serif}
          .meta{font:.8rem system-ui,sans-serif;color:#555}
          .req{overflow-wrap:anywhere}
          td{overflow-wrap:anywhere}
          td code.fijo{white-space:pre-wrap;word-break:break-all}
          .error{border-left:3px solid #8a1c1c;padding:10px 14px;background:#f6eaea;margin:16px 0}
          table{border-collapse:collapse;width:100%;font-size:.95rem}
          th,td{text-align:left;vertical-align:top;padding:6px 10px 6px 0;border-bottom:1px solid #e3e0d8}
          th{font:600 .75rem system-ui,sans-serif;color:#555;white-space:nowrap;padding-right:16px}
          .reg{padding:14px 0;border-bottom:1px solid #e3e0d8}
          .reg .tit{font-size:1.05rem}
          .sets{font:.78rem system-ui,sans-serif;color:#555}
          code{font-size:.85rem;word-break:break-all}
        </style>
      </head>
      <body><div class="wrap">
        <p class="label"><a href="/biblioteca.html#registros-marc">Biblioteca Digital de Idearium Caribe</a></p>
        <h1>Punto de cosecha OAI-PMH</h1>
        <p class="meta">Respuesta en XML para cosechadores; esta es su presentación en el navegador. · XML response for harvesters, shown here for browsers.</p>
        <nav class="verbos">
          <a href="{$base}?verb=Identify">Identify</a>
          <a href="{$base}?verb=ListMetadataFormats">ListMetadataFormats</a>
          <a href="{$base}?verb=ListSets">ListSets</a>
          <a href="{$base}?verb=ListIdentifiers&amp;metadataPrefix=oai_dc">ListIdentifiers</a>
          <a href="{$base}?verb=ListRecords&amp;metadataPrefix=oai_dc">ListRecords</a>
        </nav>
        <p class="meta req">
          <xsl:value-of select="oai:OAI-PMH/oai:responseDate"/> ·
          <xsl:for-each select="oai:OAI-PMH/oai:request/@*"><xsl:value-of select="name()"/>=<xsl:value-of select="."/><xsl:text> </xsl:text></xsl:for-each>
        </p>
        <xsl:apply-templates select="oai:OAI-PMH/oai:error"/>
        <xsl:apply-templates select="oai:OAI-PMH/oai:Identify | oai:OAI-PMH/oai:ListMetadataFormats | oai:OAI-PMH/oai:ListSets | oai:OAI-PMH/oai:ListIdentifiers | oai:OAI-PMH/oai:ListRecords | oai:OAI-PMH/oai:GetRecord"/>
      </div></body>
    </html>
  </xsl:template>

  <xsl:template match="oai:error">
    <div class="error"><strong><xsl:value-of select="@code"/></strong>: <xsl:value-of select="."/>
      <xsl:if test="@code='badVerb'"><br/>Elija una de las consultas de arriba. · Choose one of the requests above.</xsl:if>
    </div>
  </xsl:template>

  <xsl:template match="oai:Identify">
    <h2>Identify</h2>
    <table>
      <xsl:for-each select="*[not(self::oai:description)]">
        <tr><th><xsl:value-of select="local-name()"/></th><td><xsl:value-of select="."/></td></tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <xsl:template match="oai:ListMetadataFormats">
    <h2>ListMetadataFormats</h2>
    <table>
      <tr><th>metadataPrefix</th><th>schema</th></tr>
      <xsl:for-each select="oai:metadataFormat">
        <tr><td><a href="{$base}?verb=ListRecords&amp;metadataPrefix={oai:metadataPrefix}"><xsl:value-of select="oai:metadataPrefix"/></a></td><td><code><xsl:value-of select="oai:schema"/></code></td></tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <xsl:template match="oai:ListSets">
    <h2>ListSets (<xsl:value-of select="count(oai:set)"/>)</h2>
    <table>
      <xsl:for-each select="oai:set">
        <tr><td><a href="{$base}?verb=ListRecords&amp;metadataPrefix=oai_dc&amp;set={oai:setSpec}"><xsl:value-of select="oai:setName"/></a></td><td><code><xsl:value-of select="oai:setSpec"/></code></td></tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <xsl:template match="oai:ListIdentifiers | oai:ListRecords">
    <h2><xsl:value-of select="local-name()"/> (<xsl:value-of select="count(oai:header | oai:record)"/>)</h2>
    <xsl:apply-templates select="oai:header | oai:record"/>
  </xsl:template>

  <xsl:template match="oai:GetRecord">
    <h2>GetRecord</h2>
    <xsl:apply-templates select="oai:record" mode="completo"/>
  </xsl:template>

  <xsl:template match="oai:header">
    <div class="reg"><xsl:call-template name="cab"/></div>
  </xsl:template>

  <xsl:template match="oai:record">
    <div class="reg">
      <div class="tit">
        <xsl:value-of select="oai:metadata/oai_dc:dc/dc:title"/>
        <xsl:for-each select="oai:metadata/marc:record/marc:datafield[@tag='245']/marc:subfield"><xsl:value-of select="."/><xsl:text> </xsl:text></xsl:for-each>
      </div>
      <div class="sets"><xsl:for-each select="oai:metadata/oai_dc:dc/dc:creator"><xsl:value-of select="."/><xsl:if test="position()!=last()">; </xsl:if></xsl:for-each>
        <xsl:if test="oai:metadata/oai_dc:dc/dc:date"> · <xsl:value-of select="oai:metadata/oai_dc:dc/dc:date"/></xsl:if></div>
      <xsl:for-each select="oai:header"><xsl:call-template name="cab"/></xsl:for-each>
    </div>
  </xsl:template>

  <xsl:template match="oai:record" mode="completo">
    <xsl:for-each select="oai:header"><xsl:call-template name="cab"/></xsl:for-each>
    <table>
      <xsl:for-each select="oai:metadata/oai_dc:dc/*">
        <tr><th>dc:<xsl:value-of select="local-name()"/></th><td><xsl:value-of select="."/></td></tr>
      </xsl:for-each>
      <xsl:for-each select="oai:metadata/marc:record/marc:leader | oai:metadata/marc:record/marc:controlfield">
        <tr><th><xsl:choose><xsl:when test="@tag"><xsl:value-of select="@tag"/></xsl:when><xsl:otherwise>LDR</xsl:otherwise></xsl:choose></th><td><code class="fijo"><xsl:value-of select="."/></code></td></tr>
      </xsl:for-each>
      <xsl:for-each select="oai:metadata/marc:record/marc:datafield">
        <tr><th><xsl:value-of select="@tag"/><xsl:text> </xsl:text><xsl:value-of select="translate(concat(@ind1,@ind2),' ','_')"/></th>
          <td><xsl:for-each select="marc:subfield"><b>$<xsl:value-of select="@code"/></b><xsl:text> </xsl:text><xsl:value-of select="."/><xsl:text> </xsl:text></xsl:for-each></td></tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <xsl:template name="cab">
    <div class="sets">
      <a href="{$base}?verb=GetRecord&amp;metadataPrefix=oai_dc&amp;identifier={oai:identifier}"><xsl:value-of select="oai:identifier"/></a>
      (<a href="{$base}?verb=GetRecord&amp;metadataPrefix=marc21&amp;identifier={oai:identifier}">MARC</a>)
      · <xsl:value-of select="oai:datestamp"/>
      <xsl:if test="oai:setSpec"> · <xsl:for-each select="oai:setSpec"><xsl:value-of select="."/><xsl:if test="position()!=last()">, </xsl:if></xsl:for-each></xsl:if>
    </div>
  </xsl:template>
</xsl:stylesheet>
