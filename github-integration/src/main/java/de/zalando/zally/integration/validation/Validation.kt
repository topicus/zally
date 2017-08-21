package de.zalando.zally.integration.validation

import org.hibernate.annotations.Parameter
import org.hibernate.annotations.Type
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.OffsetDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EntityListeners
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@EntityListeners(value = AuditingEntityListener::class)
@Entity
data class Validation(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        var id: Long? = null,

        var repositoryUrl: String? = null,

        var apiDefinition: String? = null,

        var violations: String? = null,

        @CreatedDate
        @Column(nullable = false)
        @Type(type = "org.jadira.usertype.dateandtime.threeten.PersistentOffsetDateTime",
                parameters = arrayOf(Parameter(name = "javaZone", value = "UTC")))
        var createdOn: OffsetDateTime? = null

//TODO
//            API name (info.title from the API definition)
//            API version (info.version from the API definition)
//            pull request author ?
)