const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const contentfulBlogPost = path.resolve(`./src/templates/contentful-blog-post.js`)
  const contentfulResult = await graphql(`
  {
    allContentfulBlogPost(sort: {fields: publicationDate, order: DESC}) {
      nodes {
        slug
        id
      }
    }
  }`)

  if (contentfulResult.errors ) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      contentfulResult.errors
    )
    return
  }

  const contentfulPosts = contentfulResult.data.allContentfulBlogPost.nodes

  if(contentfulPosts.length > 0) {
    contentfulPosts.forEach((post, index) => {
      createPage({
        path:`blogs/${post.slug}`,
        component: contentfulBlogPost,
        context: {
          id: post.id
        }
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
