const asciidoctor = require('asciidoctor')()
const extractSFCBlocks = require('extract-sfc-blocks')

exports.name = 'transformer-asciidoc'

exports.apply = api => {
  // Define a new content type: asciidoc
  // Pages with extension .adoc or .asciidoc will automatically use this content type
  api.transformers.add('asciidoc', {
    extensions: ['adoc', 'asciidoc'],
    // Parse the page
    // And transform asciidoc to HTML
    parse(page) {
      // extract front matter
      const { body, frontmatter } = api.transformers.parseFrontmatter(
        page.content
      )

      // Conver AsciiDoc to HTML
      const html = asciidoctor.convert(body)

      // Extract `<script>` and `<style>` tags from HTML
      const { html: pageContent, blocks } = extractSFCBlocks(html)

      page.content = pageContent
      page.internal.hoistedTags = blocks

      // Merge front matter with page attributes
      Object.assign(page.attributes, frontmatter)
    },
    // Transform the page content to vue component
    getPageComponent(page) {
      return `<template>
        <layout-manager>
          ${page.content || ''}
        </layout-manager>
      </template>
      `
    }
  })
}