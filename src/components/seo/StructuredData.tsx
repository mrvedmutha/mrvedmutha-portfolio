import Script from 'next/script'

interface PersonStructuredDataProps {
  name: string
  jobTitle: string
  url: string
  image?: string
  email?: string
  description: string
  skills: string[]
  location?: string
}

export function PersonStructuredData({
  name,
  jobTitle,
  url,
  image,
  email,
  description,
  skills,
  location
}: PersonStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "url": url,
    "image": image,
    "email": email,
    "description": description,
    "knowsAbout": skills,
    "location": location,
    "sameAs": [
      // Add social media URLs here when available
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  }

  return (
    <Script
      id="person-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

interface BlogPostStructuredDataProps {
  title: string
  description: string
  author: string
  publishDate: string
  modifiedDate?: string
  image?: string
  url: string
}

export function BlogPostStructuredData({
  title,
  description,
  author,
  publishDate,
  modifiedDate,
  image,
  url
}: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate || publishDate,
    "image": image,
    "url": url,
    "publisher": {
      "@type": "Person",
      "name": author
    }
  }

  return (
    <Script
      id="blog-post-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

interface WebsiteStructuredDataProps {
  name: string
  url: string
  description: string
  author: string
}

export function WebsiteStructuredData({
  name,
  url,
  description,
  author
}: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": name,
    "url": url,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Person",
      "name": author
    }
  }

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}