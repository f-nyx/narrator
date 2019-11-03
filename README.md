# Narrator

## Architecture

This section describes the key concepts upon architecture decisions.

### Separation of concerns

It uses a [DDD](https://en.wikipedia.org/wiki/Domain-driven_design)-like approach to separate layers. Domain-driven
applications allow developers to switch the mindset from business logic to user logic. The domain layer describes and
represents business problems. The application layer resolves the interaction with users. Business logic delivers value
to the company, while application logic does the same for users.

This two layers of abstraction decouple the development process reducing risks of breaking production. Coupling between
domain entities and application entities usually come to serialization issues, data corruption, and extremely painful
refactors.

### Domain layer

The domain layer has entities that represent business concepts, services to operate with entities, and a data
access layer to map between domain entities and a database model. This project is built on top of
[objection.js](https://vincit.github.io/objection.js/), an ORM that abstracts a database model as JavaScript classes.

[objection.js](https://vincit.github.io/objection.js/) introduces the concept of *model*, a class which fields are
mapped to table fields. Models allow to map the full table schema in order to validate data, as well as relationships
between tables. The framework suggests to define a [BaseModel](https://github.com/f-nyx/narrator/blob/master/src/main/support/persistence/BaseModel.ts)
to set up common configuration for all models.

In order to insert or update entities the [Model](https://vincit.github.io/objection.js/api/model/) API takes plain
objects containing the data to be inserted or updated. Using plain objects along the application makes it very difficult to
refactor code. If we have structured data, we want structured objects as well. That's why we have defined a *#saveOrUpdate()*
method in the [BaseModel](https://github.com/f-nyx/narrator/blob/master/src/main/support/persistence/BaseModel.ts) class
that takes an [Entity](https://github.com/f-nyx/narrator/blob/master/src/main/support/persistence/Entity.ts) as
parameter. Entity is an interface that decouples the [objection.js](https://vincit.github.io/objection.js/) models from
domain entities. It is a flexible way to represent data in a different way than entities. You could change the database
backend or the ORM without altering the domain.

Finally we need a component to transform from domain entities to models back and forward. That's the purpose of
[DAO](https://en.wikipedia.org/wiki/Data_access_object) pattern. DAOs are classes on the top of the data access layer
that take and retrieve domain entities and internally map entities to models. The rationale behind DAOs is that
the domain layer does not need to understand how to query the data source. Queries could be quite complex even to
retrieve a single entity. Sometimes entities are assembled by several queries. DAOs guarantee the consistency between
the data source and the domain entities.

### Application layer

This project uses [express.js](https://expressjs.com/) as web application framework. The application layer consist of
operations that take user queries and send proper answers. REST and the classic MVC pattern are good enough to provide
a good user experience. The application layer usually is more flexible than the domain layer because it does not involve
complex business logic. It is straightforward and it only manages interactions between the domain services.

In order to make unit testing easier, we separated the route mapping from the logic.
[Routes](https://github.com/f-nyx/narrator/blob/master/src/main/application/Routes.ts) are mapped in a single place so
it is easier to find them. The logic to handle requests is delegated to
[controllers](https://github.com/f-nyx/narrator/blob/master/src/main/application/HomeController.ts). It makes possible
to write unit tests for controllers without dealing with the application server.

### Transactions

Most times HTTP requests are atomic operations. If something goes wrong within a request, we don't want to have
side effects. When there's an error processing a request, usually the only way to manage the error is to let it bubble
up to the user with an HTTP status code.

So the transaction-per-request pattern is the most efficient pattern to handle HTTP requests that access a data source.
It ensures a transaction is opened when a request starts, and it is committed just before sending the response. If
there's an error processing the request, the transaction is automatically rolled back. Any operation against the data
source within the request is scoped to the same transaction.

In a multi-threaded application server the transaction-per-request pattern is implemented using the 
[thread local storage](https://en.wikipedia.org/wiki/Thread-local_storage). In Node we need something to keep a
global state in the same asynchronous call chain. [cls-hooked](https://github.com/Jeff-Lewis/cls-hooked) is a library
that uses different strategies provided by Node for this purpose. The
[TransactionManager](https://github.com/f-nyx/narrator/blob/master/src/main/support/persistence/TransactionManager.ts)
uses *cls-hooked* to begin a transaction and keep it among the asynchronous call chain. The
[WebTransactionSupport](https://github.com/f-nyx/narrator/blob/master/src/main/application/WebTransactionSupport.ts)
utility wraps all request handlers to implement the transaction-per-request pattern.

### Application context

It is a good practice to wire components in a single place. The
[ApplicationContext](https://github.com/f-nyx/narrator/blob/master/src/main/config/ApplicationContext.ts) class has
this purpose. Instead of importing single components, classes that depend on other classes import the *instance*.
Additionally it has a semantic benefit: the full application can be mapped in the same place.

Finally to put it all together, the application
[entry point](https://github.com/f-nyx/narrator/blob/master/src/main/index.ts) has only two responsibilities:
to initialize the [DataSource](https://github.com/f-nyx/narrator/blob/master/src/main/config/DataSource.ts) and
to start the [WebApplication](https://github.com/f-nyx/narrator/blob/master/src/main/config/WebApplication.ts).

### A word about cls-hooked performance

*cls-hooked* uses [async hooks](https://nodejs.org/api/async_hooks.html) since Node version 8. This feature is still
in *experimental* phase so it is a risk for using in production. Some performance issues were reported in 2017, but I
didn't found performance issues since Node v10. I wrote a small
[performance test](https://github.com/f-nyx/narrator/blob/master/src/test/application/PerformanceProfile.ts) that uses
[loadTest](https://www.npmjs.com/package/loadtest) to measure the response time from an Express server using
*cls-hooked*. Both tests with and without *cls-hooked* report similar response times and RPMs. Of course, it should be
tested in different architectures and system set ups, but I strongly suspect that there's no performance impact by
using *cls-hooked*.

### TODO

* Configuration by environment
