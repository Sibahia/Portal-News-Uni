const API_BASE_URL = "http://localhost:3000"

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

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

export function createMainArticleHTML(article) {
  const timeAgo = formatTimeAgo(article.time_created)

  return `
        <a href="/article/${article.id}" class="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4 row-span-1 sm:row-span-2 md:row-span-2 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-full min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 leading-tight">${article.title}</h2>
                    <p class="text-gray-200 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-3">${truncateText(article.content, 150)}</p>
                    <div class="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-300">
                        <div class="flex items-center space-x-1">
                            <i class="fas fa-user w-3 h-3 sm:w-4 sm:h-4"></i>
                            <span>${article.autor || "Autor"}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <i class="fas fa-clock w-3 h-3 sm:w-4 sm:h-4"></i>
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

  if (size === "small") {
    return `
            <a href="/article/${article.id}" class="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div class="relative h-24 sm:h-28 md:h-32">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                </div>
                <div class="p-2 sm:p-3">
                    <h3 class="font-bold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-3 transition-colors duration-300">${article.title}</h3>
                    <p class="text-gray-600 text-xs line-clamp-1 sm:line-clamp-2 mb-2">${truncateText(article.content, 80)}</p>
                    <div class="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500">
                        <span class="truncate">${truncateText(article.autor || "Autor", 15)}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </a>
        `
  }

  return `
        <a href="/article/${article.id}" class="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-32 sm:h-40 md:h-48">
                <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
            </div>
            <div class="p-3 sm:p-4">
                <h3 class="font-bold text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 transition-colors duration-300">${article.title}</h3>
                <p class="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">${truncateText(article.content, 120)}</p>
                <div class="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500">
                    <span class="truncate">${truncateText(article.autor || "Autor", 20)}</span>
                    <span>•</span>
                    <span>${timeAgo}</span>
                </div>
            </div>
        </a>
    `
}

export function createHorizontalArticleHTML(article) {
  const timeAgo = formatTimeAgo(article.time_created)

  return `
        <a href="/article/${article.id}" class="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-3 xl:col-span-4 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="flex flex-col sm:flex-row h-auto">
                <div class="relative w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-auto flex-shrink-0">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 line-clamp-2 transition-colors duration-300">${article.title}</h3>
                        <p class="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">${truncateText(article.content, 150)}</p>
                    </div>
                    <div class="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500 mt-2">
                        <span class="truncate">${truncateText(article.autor || "Autor", 25)}</span>
                        <span>•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </div>
        </a>
    `
}

export function createSmallArticleHTML(article) {
  const timeAgo = formatTimeAgo(article.time_created)

  return `
        <a href="/article/${article.id}" class="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-20 sm:h-24 md:h-28">
                <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover">
            </div>
            <div class="p-2 sm:p-3">
                <h4 class="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-3 transition-colors duration-300">${article.title}</h4>
                <p class="text-gray-600 text-xs line-clamp-1 sm:line-clamp-2 mb-2">${truncateText(article.content, 60)}</p>
                <div class="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-500">
                    <span class="truncate">${truncateText(article.autor || "Autor", 12)}</span>
                    <span>•</span>
                    <span class="truncate">${timeAgo}</span>
                </div>
            </div>
        </a>
    `
}

export function renderNews(articles) {
  const newsGrid = document.getElementById("grids")

  if (!articles || articles.length === 0) {
    showError()
    return
  }

  let gridHTML = ""
  let usedArticles = 0

  if (articles[0]) {
    gridHTML += createMainArticleHTML(articles[0])
    usedArticles = 1
  }

  const remainingArticles = articles.slice(usedArticles)

  if (remainingArticles.length >= 1) {
    gridHTML += createSecondaryArticleHTML(remainingArticles[0], "large")
    usedArticles++
  }

  if (remainingArticles.length >= 2) {
    gridHTML += createSecondaryArticleHTML(remainingArticles[1], "small")
    usedArticles++
  }

  if (remainingArticles.length >= 3) {
    gridHTML += createHorizontalArticleHTML(remainingArticles[2])
    usedArticles++
  }

  const smallArticles = articles.slice(usedArticles)
  smallArticles.forEach((article) => {
    gridHTML += createSmallArticleHTML(article)
  })

  newsGrid.innerHTML = gridHTML
}

export function showError() {
  document.getElementById("error-message")?.classList.remove("hidden")
  const newsGrid = document.getElementById("grids")
  if (newsGrid) newsGrid.style.display = "none"
}

export function hideLoading() {
  document.getElementById("loading-screen")?.classList.add("hidden")
}

export async function fetchNews() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notices/filters?limit=8&order=DESC`)

    if (!response.ok) {
      throw new Error("API no disponible")
    }

    const result = await response.json()

    if (result.success && result.notices) {
      return result.notices
    } else if (result.notices) {
      return result.notices
    } else {
      throw new Error("Invalid API response structure")
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    throw error
  }
}
