import React from "react"
import { graphql } from "gatsby"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const ContentfulBlogPostTemplate = ({ data, location }) => {
  const post = data.contentfulBlogPost
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.title}
        description={post.description || post.excerpt || `no description lmao`}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.title}</h1>
          <p>{post.publicationDate}</p>
        </header>
        <section>
          {documentToReactComponents(post.content.json, {
            renderNode: {
              "embedded-asset-block": node => {
                const alt = node.data.target.fields.title["en-US"]
                const url = node.data.target.fields.file["en-US"].url
                return <img alt={alt} src={url} />
              }
            }
          })}
        </section>
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
    </Layout>
  )
}

export default ContentfulBlogPostTemplate

export const pageQuery = graphql`
  query ContentfulBlogPostBySlug(
    $id: String!
  ) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulBlogPost(id: {eq: $id}) {
      title
      publicationDate(formatString: "DD MMM YYYY")
      content {
        json
      }
    }
  }
`
