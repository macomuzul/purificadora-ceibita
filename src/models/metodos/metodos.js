let editarborrar = {
  async editarQueryCustom(q, data) { if(!(await this.updateOne(q, data)).modifiedCount) throw new Error() },
  async editar(_id, data) { if(!(await this.updateOne({_id}, data)).modifiedCount) throw new Error() },
  async borrar(_id) { if(!(await this.deleteOne({_id})).deletedCount) throw new Error() },
}

module.exports = { editarborrar }