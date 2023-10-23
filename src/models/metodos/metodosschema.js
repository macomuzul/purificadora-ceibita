let editarborrar = {
  async borrar(_id) { if (!(await this.deleteOne({ _id }, { sanitizeFilter: true })).deletedCount) throw new Error() },
  async borrarCustom(q) { if (!(await this.deleteOne(q, { sanitizeFilter: true })).deletedCount) throw new Error() },
  async editarCustom(q, data) { if (!(await this.updateOne(q, data, { sanitizeFilter: true })).modifiedCount) throw new Error() },
  async editar(_id, data) { if (!(await this.updateOne({ _id }, data, { sanitizeFilter: true })).modifiedCount) throw new Error() },
  async editarOCrearCustom(q, data) {
    let a = await this.updateOne(q, data, { sanitizeFilter: true, upsert: true })
    if (a.modifiedCount === 0 && a.upsertedCount === 0) throw new Error()
  },
  async editarOcrear(_id, data) {
    let a = await this.updateOne({ _id }, data, { sanitizeFilter: true, upsert: true })
    if (a.modifiedCount === 0 && a.upsertedCount === 0) throw new Error()
  },
}

module.exports = { editarborrar }