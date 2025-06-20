const API_BASE_URL = "http://localhost:3000"


function getImageUrl(image) {
  if (!image || (Array.isArray(image) && image.length === 0)) {
    return "/placeholder.jpg"; 
  }

  const imagePath = Array.isArray(image) ? image[0] : image;

  if (typeof imagePath !== "string") {
    return "/placeholder.jpg";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

export function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Hace menos de 1 hora"
  if (diffInHours < 24) return `Hace ${diffInHours} horas`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return "Hace 1 día"
  if (diffInDays < 7) return `Hace ${diffInDays} días`

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getCategoryClass(category) {
  const categoryMap = {
    Tecnología: "bg-red-600",
    Deportes: "bg-green-600",
    Política: "bg-blue-600",
    Cultura: "bg-purple-600",
    Economía: "bg-yellow-600",
    Ciencia: "bg-teal-600",
    Sociedad: "bg-pink-600",
    Educación: "bg-indigo-600",
  }
  return categoryMap[category] || "bg-gray-600"
}


export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

export function createMainArticleHTML(article) {
  const timeAgo = formatTimeAgo(article.time_created)
  const imageUrl = getImageUrl(article.image)

  return `
        <a href="/article/${article.id}" class="md:col-span-2 lg:col-span-3 md:row-span-2 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-full min-h-[300px] md:min-h-[400px]">
                <img src="${imageUrl}" alt="${article.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 class="text-2xl md:text-3xl font-bold mb-3 leading-tight">${article.title}</h2>
                    <p class="text-gray-200 mb-4 line-clamp-3">${truncateText(article.content, 150)}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-300">
                        <div class="flex items-center space-x-1">
                            <i class="fas fa-user w-4 h-4"></i>
                            <span>${article.autor}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <i class="fas fa-clock w-4 h-4"></i>
                            <span>${timeAgo}</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    `
}

export function createSecondaryArticleHTML(article, size = "large") {
  const timeAgo = formatTimeAgo(article.time_created)
  const imageUrl = getImageUrl(article.image)

  if (size === "small") {
    return `
            <a href="/article/${article.id}" class="md:col-span-2 lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div class="relative h-32">
                    <img src="${imageUrl}" alt="${article.title}" class="w-full h-full object-cover">
                </div>
                <div class="p-3">
                    <h3 class="font-bold text-sm mb-2 line-clamp-3 transition-colors duration-300">${article.title}</h3>
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
                        <span>${article.autor}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </a>
        `
  }

  return `
        <a href="/article/${article.id}" class="md:col-span-2 lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-48">
                <img src="${imageUrl}" alt="${article.title}" class="w-full h-full object-cover">
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2 line-clamp-2 transition-colors duration-300">${article.title}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${truncateText(article.content, 100)}</p>
                <div class="flex items-center space-x-3 text-xs text-gray-500">
                    <span>${article.autor}</span>
                    <span>•</span>
                    <span>${timeAgo}</span>
                </div>
            </div>
        </a>
    `
}

export function createHorizontalArticleHTML(article) {
  const timeAgo = formatTimeAgo(article.time_created)
  const imageUrl = getImageUrl(article.image)

  return `
        <a href="/article/${article.id}" class="md:col-span-4 lg:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="flex flex-col md:flex-row h-auto md:h-32">
                <div class="relative w-full md:w-48 h-32 md:h-full flex-shrink-0">
                    <img src="${imageUrl}" alt="${article.title}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-lg mb-2 line-clamp-2 transition-colors duration-300">${article.title}</h3>
                        <p class="text-gray-600 text-sm line-clamp-2">${truncateText(article.content, 120)}</p>
                    </div>
                    <div class="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                        <span>${article.autor}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </div>
        </a>
    `
}

export function createSmallArticlesHTML(articles) {
  const articlesHTML = articles
    .map((article) => {
      const timeAgo = formatTimeAgo(article.time_created)
      const imageUrl = getImageUrl(article.image)

      return `
            <a href="/article/${article.id}" class="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div class="relative h-24">
                    <img src="${imageUrl}" alt="${article.title}" class="w-full h-full object-cover">
                </div>
                <div class="p-4">
                    <h4 class="font-semibold text-sm mb-2 line-clamp-3 transition-colors duration-300">${article.title}</h4>
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
                        <span>${article.autor}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </a>
        `
    })
    .join("")

  return `
        <div class="md:col-span-4 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            ${articlesHTML}
        </div>
    `
}

export function renderNews(articles) {
  const newsGrid = document.getElementById("news-grid")

  if (!articles || articles.length === 0) {
    showError()
    return
  }

  const mainArticle = articles[0]
  const secondaryArticles = articles.slice(1, 6)
  const smallArticles = articles.slice(6, 9)

  let gridHTML = ""

  if (mainArticle) {
    gridHTML += createMainArticleHTML(mainArticle)
  }

  secondaryArticles.forEach((article, index) => {
    if (index === 0) {
      gridHTML += createSecondaryArticleHTML(article, "large")
    } else if (index === 1 || index === 4) {
      gridHTML += createSecondaryArticleHTML(article, "small")
    } else if (index === 2) {
      gridHTML += createSecondaryArticleHTML(article, "large")
    } else if (index === 3) {
      gridHTML += createHorizontalArticleHTML(article)
    }
  })

  if (smallArticles.length > 0) {
    gridHTML += createSmallArticlesHTML(smallArticles)
  }

  newsGrid.innerHTML = gridHTML
}

export function showError() {
  document.getElementById("error-message")?.classList.remove("hidden")
  const newsGrid = document.getElementById("news-grid")
  if (newsGrid) newsGrid.style.display = "none"
}

export function hideLoading() {
  document.getElementById("loading-screen")?.classList.add("hidden")
}

export async function fetchNews() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notices`)

    if (!response.ok) {
      throw new Error("API no disponible")
    }

    const result = await response.json()
    return result.notices
  } catch (error) {

    await new Promise((resolve) => setTimeout(resolve, 25000))
  }
}
