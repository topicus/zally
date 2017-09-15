package de.zalando.zally.rule

data class Path (
    var path: String? = null,
    var method: String? = null,
    var statusCode: String? = null,
    var message: String? = null
)