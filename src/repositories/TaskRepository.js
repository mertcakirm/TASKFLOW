const BaseRepository = require("./baseRepository");
const { Task } = require("../context/context");

class TaskRepository extends BaseRepository {
    constructor() {
        super(Task);
    }

    async findByStatus(status, options = {}) {
        return await this.model.findAll({ where: { status }, ...options });
    }

    async findByPriority(priority, options = {}) {
        return await this.model.findAll({ where: { priority }, ...options });
    }

}

module.exports = TaskRepository;