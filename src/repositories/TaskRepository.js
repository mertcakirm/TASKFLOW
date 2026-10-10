const BaseRepository = require("./baseRepository");

class TaskRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findByStatus(status, options = {}) {
        return await this.model.findAll({ where: { status }, ...options });
    }

    async findByPriority(priority, options = {}) {
        return await this.model.findAll({ where: { priority }, ...options });
    }


    
}

module.exports = TaskRepository;