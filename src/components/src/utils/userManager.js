import { createUserManager } from 'redux-oidc';
import dotenv from "dotenv"
dotenv.config()
const { REACT_APP_B2C_TENANT_ID, REACT_APP_B2C_CLIENT_ID, REACT_APP_B2C_RESOURCE_ID } = process.env

const clientId = REACT_APP_B2C_CLIENT_ID
const tenantId = REACT_APP_B2C_TENANT_ID
const resourceId = REACT_APP_B2C_RESOURCE_ID

const userManagerConfig = {
  authority: `https://dms20prod.b2clogin.com/dms20prod.onmicrosoft.com/B2C_1_dms_signup_signin`,
  client_id: clientId,
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}/callback`,
  post_logout_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}`,
  automaticSilentRenew: false,
  filterProtocolClaims: true,
  loadUserInfo: true,
  scope: "openid",
  // scope: ["User.Read"],
  forgetPassword: '',
  response_type: "id_token",
  extraQueryParams: {
    resource: resourceId
  },
  signingKeys: [
    {
      "kid": "6iA2BQPSeGmqfxJ7-TJ4TAqeK7nBOw897mysMHg6PGE",
      "use": "sig",
      "key_ops": [
        "sign"
      ],
      "kty": "RSA",
      "e": "AQAB",
      "n": "poN6bK_NGFr53OCuGv74vXfHc8nf2CpmnUFyRPkyYMdSmc8wgDisaR5nIoLq_GdcHEtmjQbJ2oTO5yJCUdUfQQnlqtb4K4y_N8hLqf9-S2Y2vy2Bn-htkF99cYKdtsLQKhmvhEtRfJc-aLfklf2GloCYX-qspcc-oBlbHsSliV0fgGkXBtvU4bAwJepX0QAao8pCvwzTI7ReR8ik0XmyZknpI34C0AI2whORHd6x89Psj_x95vOgwDUFqWJe8gf-ZERfm7eaNC_lnB9ykhD-sqqw5REFMKOapR1J4K08iGsw7fYN36l9KUQuih31SGmycfq7pFtRQmCdumCehwPOHQ"
    }
  ]
};

const userManager = createUserManager(userManagerConfig);

export default userManager;

// http://localhost:3000/callback#error=access_denied&error_description=AADB2C90118%3a+The+user+has+forgotten+their+password.%0d%0aCorrelation+ID%3a+9cf9ee35-db9c-40e1-9958-4b758492421a%0d%0aTimestamp%3a+2021-08-02+10%3a35%3a08Z%0d%0alogin_hint%3a+olabanjiabimbola%40gmail.com%0d%0a&state=313027805e4b4e59a3f89bbe7e2dd012