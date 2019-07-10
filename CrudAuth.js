module.exports = {
    allow: (options={}) => {
        const {
            canCreate = () => true, 
            canUpdate = () => true, 
            canFindAll = () => true, 
            canFindOne = () => true, 
            canDelete = () => true 
        } = options;
        return {
            canCreate, 
            canUpdate, 
            canFindAll, 
            canFindOne, 
            canDelete
        }
    },
    deny: (options={}) => {
        const {
            canCreate = () => false, 
            canUpdate = () => false, 
            canFindAll = () => false, 
            canFindOne = () => false, 
            canDelete = () => false
        } = options;
        return {
            canCreate, 
            canUpdate, 
            canFindAll, 
            canFindOne, 
            canDelete
        }
    },
    check: ({canCreate = false, canUpdate = false, canFindAll = false, canFindOne = false, canDelete = false }) => {
        return canCreate && canUpdate && canFindAll && canFindOne && canDelete;
    }
}
