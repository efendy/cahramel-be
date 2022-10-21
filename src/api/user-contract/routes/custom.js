module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/user-contracts/draft/save',
      handler: 'user-contract.draftSave',
    },
    {
      method: 'GET',
      path: '/user-contracts/draft/delete/:id',
      handler: 'user-contract.draftDelete',
    },
    {
      method: 'POST',
      path: '/user-contracts/draft/confirm',
      handler: 'user-contract.draftConfirm',
    },
    {
      method: 'GET',
      path: '/user-contracts/invite/:code',
      handler: 'user-contract.inviteCheck',
    },
    {
      method: 'POST',
      path: '/user-contracts/link',
      handler: 'user-contract.linkUser',
    },
  ]
}
