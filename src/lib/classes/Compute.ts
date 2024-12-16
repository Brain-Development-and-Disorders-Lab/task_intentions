/**
 * @file 'Compute' class used to run the model locally in the browser using WebR.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging library
import consola from "consola";

// R runtime library
import { WebR } from "webr";
import { WebRDataJsNode } from "webr/dist/webR/robj";

const MODEL_DATA = `,ID,Trial,Option1_PPT,Option1_Partner,Option2_PPT,Option2_Partner,PPTActions,Action,Correct,FixActions,Phase
1,NA,1,6,6,10,6,2,1,NA,NA,1
2,NA,2,7,7,10,7,1,1,NA,NA,1
3,NA,3,8,8,10,8,2,1,NA,NA,1
4,NA,4,6,6,6,2,1,1,NA,NA,1
5,NA,5,7,7,7,2,1,1,NA,NA,1
6,NA,6,8,8,8,2,1,1,NA,NA,1
7,NA,7,6,2,8,6,2,2,NA,NA,1
8,NA,8,7,2,8,6,1,2,NA,NA,1
9,NA,9,8,2,9,6,2,2,NA,NA,1
10,NA,10,12,8,8,8,1,2,NA,NA,1
11,NA,11,12,9,9,9,2,2,NA,NA,1
12,NA,12,12,10,10,10,2,2,NA,NA,1
13,NA,13,8,5,8,8,2,2,NA,NA,1
14,NA,14,9,5,9,9,2,2,NA,NA,1
15,NA,15,10,5,10,10,2,2,NA,NA,1
16,NA,16,10,6,8,2,1,2,NA,NA,1
17,NA,17,11,6,9,2,1,2,NA,NA,1
18,NA,18,12,6,10,2,2,2,NA,NA,1
19,NA,19,4,4,8,4,2,1,NA,NA,1
20,NA,20,5,5,8,5,2,1,NA,NA,1
21,NA,21,6,6,8,6,2,1,NA,NA,1
22,NA,22,5,5,5,1,1,1,NA,NA,1
23,NA,23,6,6,6,1,2,1,NA,NA,1
24,NA,24,7,7,7,1,1,1,NA,NA,1
25,NA,25,5,1,7,5,1,2,NA,NA,1
26,NA,26,6,1,7,5,1,2,NA,NA,1
27,NA,27,7,1,8,5,2,2,NA,NA,1
28,NA,28,10,6,6,6,1,2,NA,NA,1
29,NA,29,10,7,7,7,1,2,NA,NA,1
30,NA,30,10,8,8,8,1,2,NA,NA,1
31,NA,31,6,3,6,6,2,2,NA,NA,1
32,NA,32,7,3,7,7,1,2,NA,NA,1
33,NA,33,8,3,8,8,1,2,NA,NA,1
34,NA,34,9,5,7,1,1,2,NA,NA,1
35,NA,35,10,5,8,1,1,2,NA,NA,1
36,NA,36,11,5,9,1,1,2,NA,NA,1
37,NA,37,6,6,10,6,2,1,0,2,2
38,NA,38,7,7,10,7,2,1,0,1,2
39,NA,39,8,8,10,8,1,1,1,1,2
40,NA,40,6,6,6,2,1,1,1,1,2
41,NA,41,7,7,7,2,1,1,1,1,2
42,NA,42,8,8,8,2,1,1,1,1,2
43,NA,43,6,2,8,6,2,2,1,2,2
44,NA,44,7,2,8,6,2,2,1,2,2
45,NA,45,8,2,9,6,1,2,0,2,2
46,NA,46,12,8,8,8,1,2,0,1,2
47,NA,47,12,9,9,9,2,2,1,2,2
48,NA,48,12,10,10,10,2,2,1,1,2
49,NA,49,8,5,8,8,2,2,1,1,2
50,NA,50,9,5,9,9,2,2,1,2,2
51,NA,51,10,5,10,10,2,2,1,1,2
52,NA,52,10,6,8,2,1,1,1,2,2
53,NA,53,11,6,9,2,1,1,1,1,2
54,NA,54,12,6,10,2,1,1,1,1,2
55,NA,55,10,6,6,6,2,2,1,2,2
56,NA,56,10,7,7,7,2,2,1,2,2
57,NA,57,10,8,8,8,1,2,0,1,2
58,NA,58,6,2,6,6,2,2,1,2,2
59,NA,59,7,2,7,7,2,2,1,2,2
60,NA,60,8,2,8,8,2,2,1,2,2
61,NA,61,8,6,6,2,1,1,1,1,2
62,NA,62,8,6,7,2,1,1,1,2,2
63,NA,63,9,6,8,2,1,1,1,1,2
64,NA,64,8,8,12,8,1,1,1,1,2
65,NA,65,9,9,12,9,1,1,1,1,2
66,NA,66,10,10,12,10,2,1,0,2,2
67,NA,67,8,8,8,5,1,1,1,2,2
68,NA,68,9,9,9,5,1,1,1,1,2
69,NA,69,10,10,10,5,1,1,1,1,2
70,NA,70,8,2,10,6,2,2,1,2,2
71,NA,71,9,2,11,6,2,2,1,1,2
72,NA,72,10,2,12,6,2,2,1,2,2
73,NA,73,4,4,8,4,1,1,1,1,2
74,NA,74,5,5,8,5,1,1,1,1,2
75,NA,75,6,6,8,6,1,1,1,1,2
76,NA,76,5,5,5,1,1,1,1,1,2
77,NA,77,6,6,6,1,1,1,1,1,2
78,NA,78,7,7,7,1,1,1,1,1,2
79,NA,79,5,1,7,5,2,2,1,1,2
80,NA,80,6,1,7,5,2,2,1,1,2
81,NA,81,7,1,8,5,2,2,1,1,2
82,NA,82,10,6,6,6,2,2,1,1,2
83,NA,83,10,7,7,7,2,2,1,2,2
84,NA,84,10,8,8,8,2,2,1,2,2
85,NA,85,6,3,6,6,2,2,1,2,2
86,NA,86,7,3,7,7,2,2,1,2,2
87,NA,87,8,3,8,8,2,2,1,2,2
88,NA,88,9,5,7,1,1,1,1,1,2
89,NA,89,10,5,8,1,1,1,1,1,2
90,NA,90,11,5,9,1,1,1,1,1,2
91,NA,91,6,6,10,6,1,1,NA,NA,3
92,NA,92,7,7,10,7,2,1,NA,NA,3
93,NA,93,8,8,10,8,1,1,NA,NA,3
94,NA,94,6,6,6,2,1,1,NA,NA,3
95,NA,95,7,7,7,2,2,1,NA,NA,3
96,NA,96,8,8,8,2,1,1,NA,NA,3
97,NA,97,6,2,8,6,2,2,NA,NA,3
98,NA,98,7,2,8,6,2,2,NA,NA,3
99,NA,99,8,2,9,6,2,2,NA,NA,3
100,NA,100,12,8,8,8,1,2,NA,NA,3
101,NA,101,12,9,9,9,1,2,NA,NA,3
102,NA,102,12,10,10,10,1,2,NA,NA,3
103,NA,103,8,5,8,8,2,2,NA,NA,3
104,NA,104,9,5,9,9,2,2,NA,NA,3
105,NA,105,10,5,10,10,2,2,NA,NA,3
106,NA,106,10,6,8,2,1,2,NA,NA,3
107,NA,107,11,6,9,2,2,2,NA,NA,3
108,NA,108,12,6,10,2,1,2,NA,NA,3
109,NA,109,4,4,8,4,1,1,NA,NA,3
110,NA,110,5,5,8,5,2,1,NA,NA,3
111,NA,111,6,6,8,6,2,1,NA,NA,3
112,NA,112,5,5,5,1,1,1,NA,NA,3
113,NA,113,6,6,6,1,1,1,NA,NA,3
114,NA,114,7,7,7,1,1,1,NA,NA,3
115,NA,115,5,1,7,5,1,2,NA,NA,3
116,NA,116,6,1,7,5,1,2,NA,NA,3
117,NA,117,7,1,8,5,2,2,NA,NA,3
118,NA,118,10,6,6,6,1,2,NA,NA,3
119,NA,119,10,7,7,7,2,2,NA,NA,3
120,NA,120,10,8,8,8,1,2,NA,NA,3
121,NA,121,6,3,6,6,2,2,NA,NA,3
122,NA,122,7,3,7,7,2,2,NA,NA,3
123,NA,123,8,3,8,8,2,2,NA,NA,3
124,NA,124,9,5,7,1,2,2,NA,NA,3
125,NA,125,10,5,8,1,1,2,NA,NA,3
126,NA,126,11,5,9,1,1,2,NA,NA,3`;

const FUNCTIONS = `
# Barnby (2022) Inequality Aversion and Paranoia
#
# Joe Barnby joe.barnby@rhul.ac.uk 2022

library(jsonlite)
library(doParallel)
library(dplyr)
library(logger)

# Phase 1 Fly Fitting -----------------------------------------------------

matching_partner_incremental_fit <- function(phase1data, precan_df, shuffle = T, file_loc = F){

  if(file_loc == T){
    phase1data <- read.csv(phase1data)
  } else {
    phase1data <- phase1data
  }

    cat('NEWLINE *** FITTING PARTICIPANT ***NEWLINE')

  phase1pars <- set_up_beliefs() %>%
                incremental_fit(data = phase1data) %>%
                marginalise()

    cat('NEWLINE PARTICIPANT PARAMETERS ARE',phase1pars,'NEWLINE')
    cat('NEWLINE *** CREATING OPTIMAL PARTNER ***NEWLINE')

  participant_decisions <- simulate_phase_decisions(phase1pars,
                                                      precan_df %>%
                                                        mutate(ID = NA, Trial = 1:54, Phase = 2) %>%
                                                        dplyr::select(ID, Trial, ppt1:par2, Phase, everything()),
                                                      phase = 2)
    bound_dfs <- participant_decisions %>%
      cbind(precan_df %>% dplyr::select(-ppt1:-par2))
    n_p <- length(bound_dfs %>% dplyr::select(-ppt1:-Ac))
    similarity_vec <- rep(NA, n_p)
    for(i in 1:n_p){
      similarity_vec[i] <- bound_dfs %>%
        mutate(correct = ifelse(Ac == bound_dfs[,(i+4)], 1, 0)) %>%
        summarise(correct = sum(correct)/54) %>%
        as.numeric()
    }

    index_part_1 <- which((similarity_vec > 0.3 & similarity_vec < 0.5), arr.ind = T)
    index_part   <- sample(index_part_1, 1)

    cat("NEWLINE PARTNER'S PARAMETERS ARE",colnames(bound_dfs)[index_part+5], "NEWLINENEWLINE")

    partner_decisions <- bound_dfs %>%
      dplyr::select(1:4, index_part+5) %>%
      rename(Ac = 5)

    if (shuffle == T) {
      set.seed(156)
      row <- sample(nrow(partner_decisions))
      partner_decisions <- partner_decisions[row, ]
      partner_decisions
    }

  return(list(
    phase1pars, # Participant parameters
    colnames(bound_dfs)[index_part + 5], # Partner parameters
    partner_decisions # Partner decisions, phase 2
  ))

}

matching_partner_phase2 <- function(Phase1Data, data, shuffle = F, file_loc = F){

  if(file_loc == T){
    exampleData <- read.csv(Phase1Data)
  } else if(file_loc == F){
    exampleData <- Phase1Data
  }

    cat('NEWLINENEWLINE *** ESTIMATING PARTICIPANT PREFERENCES ***NEWLINENEWLINE')

  phase1ppt         <- fit_participant_pars_phase1(exampleData)
  phase1par         <- phase1ppt

    cat('NEWLINE PARTICIPANT PARAMETERS ARE',phase1par,'NEWLINE')
    cat('NEWLINE *** CREATING OPTIMAL PARTNER ***NEWLINE')

  partner_parms     <- gridsearch_for_partner_phase2(phase1par, data)
  partner_parms

    cat("NEWLINE PARTNER'S PARAMETERS ARE",partner_parms, "NEWLINE")
    cat('NEWLINE *** SIMULATING PARTNER DECISIONS ***NEWLINENEWLINE')

  partner_decisions <- simulate_phase_decisions(partner_parms, data)
  partici_decisions <- simulate_phase_decisions(phase1ppt, data)

    cat('NEWLINE Done NEWLINE')

  if(shuffle == T){
  set.seed(156)
  row <- sample(nrow(partner_decisions))
  partner_decisions <- partner_decisions[row,]
  partner_decisions
  }

  return(list(PPTp = phase1ppt,
              PARp = partner_parms,
              PPTd = partici_decisions,
              PARd = partner_decisions %>% rename(AcPar = 5)))

}

matching_partner_phase1 <- function(Phase1Data, data, file_loc = T, shuffle = T){

  if(file_loc == T){

  test_data_real <- read.csv(Phase1Data)

  test_data_phase1 <- test_data_real %>%
    as_tibble() %>%
    rename(ID = Participant.Public.ID
           ) %>%
    mutate(ID = as.character(ID), Phase = 1) %>%
    dplyr::select(ID, trial,
                  s1 = playerPoints_option1, o1 = partnerPoints_option1,
                  s2 = playerPoints_option2, o2 = partnerPoints_option2,
                  PPTANS = selectedOption_player, Phase) %>%
    filter(!is.na(trial)) %>%
    slice(1:36) %>%
    dplyr::select(ID, trial, s1:o2,PPTANS, Phase)
    } else { test_data_phase1 <- as.data.frame(Phase1Data) %>% rename(PPTANS = 7)}

    cat('NEWLINE *** CREATING OPTIMAL PARTNER ***NEWLINE')

  partner_parms     <- gridsearch_for_partner_phase1(test_data_phase1)
  partner_parms2    <- as.numeric(partner_parms[1:2])

    cat("NEWLINE PARTNER'S PARAMETERS ARE",partner_parms, "NEWLINE")
    cat('NEWLINE *** SIMULATING PARTNER DECISIONS ***NEWLINENEWLINE')

  partner_decisions <- simulate_phase_decisions(partner_parms2, data, phase = 2)
  partici_decisions <- test_data_phase1

    cat('NEWLINE Done NEWLINE')

  if(shuffle == T){
  set.seed(156)
  row <- sample(nrow(partner_decisions))
  partner_decisions <- partner_decisions[row,]
  partner_decisions
  }

  return(list(PARp = partner_parms,
              PPTd = partici_decisions,
              PARd = partner_decisions %>% rename(AcPar = 5)))

}

ABA_Phase1_Only <- function(parms, data, sim = 0){

  # Initialise

  res = 30; # resolution of belief grid
  T1  = length(data %>% filter(Phase == 1) %>% rownames());  # trials for phase 1

  #Phase 1
  alpha            = parms[1];
  beta             = parms[2];
  alpha_v          = parms[3];
  beta_v           = parms[4];

  # grid for a subjects beliefs over their preferences in phase 1
  #parameters space of alpha and beta
  grid <- matlab::meshgrid(seq(0, res, 0.125),seq(-res, res, 0.25));
  alpha_grid <- grid$x
  beta_grid  <- grid$y

  #generate standardised grid to form priors for preferences
  pabg <- dnorm(alpha_grid,alpha,alpha_v)*dnorm(beta_grid,beta,beta_v);
  pabg <- pabg / sum(as.vector(pabg));

  # initialised dummy values

  lik1        <- 0;   # likelihood for choices in phase 1
  prob1       <- rep(NA, T1)
  simA        <- rep(NA, T1)
  LL          <- 0

  # Phase 1 choices of the participant

    for (t in 1:T1){

    s1 = as.numeric(data[t, 3]/10);
    o1 = as.numeric(data[t, 4]/10);
    s2 = as.numeric(data[t, 5]/10);
    o2 = as.numeric(data[t, 6]/10);

    val1 = alpha_grid*s1 + beta_grid*max(s1-o1,0) ;
    val2 = alpha_grid*s2 + beta_grid*max(s2-o2,0) ;

    pchoose1=(1/(1+exp(-(val1 - val2)))); # probability of 1
    tmp_ppt=pchoose1 * pabg;
    subject_netp1 = sum(as.vector(tmp_ppt));
    simA[t] = sample(c(1,2),1, prob = c(subject_netp1, 1-subject_netp1));

      if (sim){
        actual_choice = simA[t];
      } else {
        actual_choice = data[t, 7];
      }

      if (actual_choice==1){
      lik1 = lik1 + log(subject_netp1); # log likelihood of 1
      prob1[t] = subject_netp1;
      } else {
      lik1 = lik1 + log(1-subject_netp1);
      prob1[t] = 1-subject_netp1;
      }

    }

    LL = lik1

      if(sim){
      return(list(Actions = simA, Prob1 = prob1, LL = LL))
      } else {
      return(LL)
      }

} # end of function

ABA_wrapper_Phase1_Only <- function(ParM, datAr, scbeta0=-1,details=0){

  parM <- as.vector(ParM) # in case it's inputted in another format
  parn <- length(parM)

  if ((scbeta0[1] < 0) && !is.na(scbeta0)){
    # i.e. a number, but not a valid scaled distr. param.,
    # which means 'use default, weak regularizing priors'
    scbeta0 <- matrix(c(1.05,1.05,0, 30,
                        1.05,1.05,-30, 30,
                        1.05,1.05,0.01, 10,
                        1.05,1.05,0.01, 10
    ),
    nrow=4, ncol=parn)

    if(details){
      colnames(scbeta0) <-   c('alphappt', 'betappt', 'alphasd', 'betasd')
      rownames(scbeta0) <-   c('ashape','bshape','min','max')
    }
  }

  # Cacl. the log prior for MAP purposes etc, all calc'd in short form:
  mSLPrior <- 0;
  if (length(scbeta0)>1){
    mSLPrior <- mSLPrior - sum(dbetasc( parM,
                                        scbeta0[1,1:parn],scbeta0[2,1:parn],
                                        scbeta0[3,1:parn],scbeta0[4,1:parn], log=TRUE));
  }

  if (!details){
    if (mSLPrior == Inf){  # If we are in an a priori prohibited parameter region
      # do not attempt to calculate the likelihood - it will be nonsense anyway.
      return(Inf);
    } else {
      return(mSLPrior - ABA_Phase1_Only(ParM,datAr,sim=0))
    }
  } else {
    res = list();
    res[[2]] <- scbeta0;
    res[[3]] <- ParM;        res[[4]] <- datAr;
    if (mSLPrior == Inf){
      res[[1]] <- Inf; res[[5]] <- NA;
    } else {
      res[[5]] <- ABA_Phase1_Only(ParM,datAr,sim=0);
      res[[1]] <- mSLPrior - res[[5]];
    }
    names(res) <- c('sLP','scbeta0','par','dat','sLL')
    return(res)
  }


} # end of function

fit_participant_pars_phase1 <- function(data){

    # Take phase 1 trials only
    Phase1Trials<- data %>% filter(Phase == 1)

    # Select some random starting pars
    rand_par0    <- rep(NA, 4)
    rand_par0[1] <- mysamp(1, 2, 4, 0, 30, 1000)
    rand_par0[2] <- mysamp(1, 0, 4, -30, 30, 1000)
    rand_par0[3] <- mysamp(1, 2, 4, 0, 10, 1000)
    rand_par0[4] <- mysamp(1, 2, 4, 0, 10, 1000)

    #SANNpar <- optim(rand_par0,
    #                 ABA_wrapper_Phase1_Only,
    #                 datAr = Phase1Trials,
    #                 scbeta0 = -1,
    #                 method = 'SANN',
    #                 control = list(maxit = 100, trace = 100, temp = 100, REPORT = T))

    #cat('NEWLINE SANN estimates are', SANNpar$par, 'NEWLINE')

    OPTIMpar<- optim(rand_par0, #SANNpar$par,
                     ABA_wrapper_Phase1_Only,
                     datAr = Phase1Trials,
                     scbeta0 = -1,
                     control = list(maxit = 500, trace = 10, REPORT = T))

    return(OPTIMpar$par)

}

gridsearch_for_partner_phase2 <- function(phase1par, data, cores = 4, res = 30, by = 1){

  alpha = c(0, 5, 10, 15, 20)
  beta = c(-30, -20, -10, 0, 10, 20, 30)
  #res = 30
  #by  = 1
  mat = matrix(NA, length(alpha), length(beta))
  cor = simulate_phase_decisions(phase1par, data) %>% rename(PPTANS = Ac)
  doParallel::registerDoParallel(cores = cores)

  for (i in 1:length(alpha)){
    beta_sweep <- foreach (j = 1:length(beta), .combine = rbind)%dopar%{

      test_run <- simulate_phase_decisions(c(alpha[i], beta[j]), data, phase = 2)
      check_cor<- cbind(cor, test_run[,5])
      check_cor %>%
        mutate(Same = ifelse(PPTANS == Ac, 1, 0)) %>%
        summarise(TotalCorrect = sum(Same)/54) %>%
        as.numeric()

    }

    mat[i,] <- as.numeric(beta_sweep)

  }

  series_par <- which.min(c(mat[1,1],mat[5,4], mat[1,7]))
  if(series_par == 1) {
    Partner = 'Prosocial'; beta = -20; alpha = 0
  }else if(series_par==2){
    Partner = 'Individualist'; beta = 0; alpha = 20
  }else{
    Partner ='Competitive'; beta = 20; alpha = 0}

  cat('NEWLINE PARTNER IS ',Partner,'NEWLINE')

  return(c(alpha, beta))
}

gridsearch_for_partner_phase1 <- function(phase1_data, cores = 4){

  alpha = c(0, 5, 10, 15, 20)
  beta = c(-30, -20, -10, 0, 10, 20, 30)
  mat = matrix(NA, length(alpha), length(beta))

  doParallel::registerDoParallel(cores = cores)

  for (i in 1:length(alpha)){
    beta_sweep <- foreach (j = 1:length(beta), .combine = rbind)%dopar%{

      test_run <- simulate_phase_decisions(c(alpha[i], beta[j]), phase1_data, phase = 1)
      check_cor<- cbind(phase1_data, test_run[,5])
      check_cor %>%
        mutate(Same = ifelse(PPTANS == Ac, 1, 0)) %>%
        summarise(TotalCorrect = sum(Same)/36) %>%
        as.numeric()

    }
    mat[i,] <- as.numeric(beta_sweep)

  }

  series_par <- which.min(c(mat[1,1],mat[5,4], mat[1,7]))
  if(series_par == 1) {Partner = 'Prosocial'; beta = -30; alpha = 0
  }else if(series_par==2){ Partner = 'Individualist' ; beta = 0; alpha = 30
  }else{Partner ='Competitive'; beta = 30; alpha = 0}

  cat('NEWLINE PARTNER IS ',Partner,'NEWLINE')
  return(c(alpha, beta, Partner))
}

simulate_phase_decisions <- function(parms, data, phase = 2){

  # Initialise

  res = 30; # resolution of belief grid
  T1  = length(data %>% filter(Phase == phase) %>% rownames());  # trials for phase 1

  #Phase 1
  alpha            = as.numeric(parms[1])
  beta             = as.numeric(parms[2])

  # initialised dummy values
  decisions        <- data.frame(
    ppt1 = rep(NA, T1),
    par1 = rep(NA, T1),
    ppt2 = rep(NA, T1),
    par2 = rep(NA, T1),
    Ac   = rep(NA, T1)
  )

  if(length(parms) == 3){decisions$type = parms[3]}

  # Phase 1 choices of the participant

    for (t in 1:T1){

    s1 = as.numeric(data[t, 3]/10);
    o1 = as.numeric(data[t, 4]/10);
    s2 = as.numeric(data[t, 5]/10);
    o2 = as.numeric(data[t, 6]/10);

    decisions[t, 1] = s1*10
    decisions[t, 2] = o1*10
    decisions[t, 3] = s2*10
    decisions[t, 4] = o2*10

    val1 = alpha*s1 + beta*max(s1-o1,0) ;
    val2 = alpha*s2 + beta*max(s2-o2,0) ;

    pchoose1=(1/(1+exp(-(val1 - val2)))); # probability of 1
    simA = sample(c(1,2),1, prob = c(pchoose1, 1-pchoose1));

    decisions[t, 5] = simA;

    }

      return(decisions)


} # end of function

precan_partners <- function(data){

  limit             =  16
  alpha             =  seq(0, limit, 2)
  beta              =  seq(-limit, limit, 2)
  partner_types     =  apply(expand.grid(alpha, beta), 1, paste, collapse=" ")
  partner_exclude   =  rep(NA, limit)
  partner_exclude2  =  rep(NA, limit)
  for(i in 1:(limit+1)){partner_exclude[i] = paste(i-1, i-1, sep = ' ')}
  for(i in 1:(limit))  {partner_exclude2[i]= paste(i, -i, sep = ' ')}
  partner_types     =  setdiff(partner_types, c(partner_exclude, partner_exclude2))
  partner_choices   =  list()

  for (i in 1:length(alpha)){

    beta_sweep <- foreach (j = 1:length(beta), .combine = rbind)%dopar%{

      phasedecs <- simulate_phase_decisions(c(alpha[i], beta[j]), data, phase = 2) %>%
        mutate(parsa = alpha[i], parsb = beta[j])

    }

    partner_choices[[i]] <- beta_sweep

  }

  for (i in 1:length(alpha)) {
    partner_choices[[i]] <- split(partner_choices[[i]],partner_choices[[i]]$parsb)
    for(j in 1:length(beta)){
    colnames(partner_choices[[i]][[j]])[5] <- paste(partner_choices[[i]][[j]][1,6], partner_choices[[i]][[j]][1,7])
    partner_choices[[1]][[1]] <- partner_choices[[1]][[1]] %>% mutate(partner_choices[[i]][[j]])
    }
  }

  partner_choices_df <- partner_choices[[1]][[1]] %>%
    dplyr::select(1:4,
      all_of(partner_types)
      )

  return(partner_choices_df)
}

set_up_beliefs  <- function(){

  grid <- matlab::meshgrid(seq(0, 30, 0.125),seq(-30, 30, 0.25));
  alpha_grid <- grid$x
  beta_grid  <- grid$y
  #generate standardised grid to form priors for preferences
  belief_grid <- dnorm(alpha_grid,15,10)*dnorm(beta_grid,0,10);
  belief_grid <- belief_grid / sum(as.vector(belief_grid));

  return(belief_grid)

}

incremental_fit <- function(belief_grid, data){

    #parameters space of alpha and beta
    grid <- matlab::meshgrid(seq(0, 30, 0.125),seq(-30, 30, 0.25));
    alpha_grid <- grid$x
    beta_grid  <- grid$y

    for (t in 1:length(data[,1])){

        s1 = as.numeric(data[t, 3]/10);
        o1 = as.numeric(data[t, 4]/10);
        s2 = as.numeric(data[t, 5]/10);
        o2 = as.numeric(data[t, 6]/10);

        val1 = alpha_grid*s1 + beta_grid*max(s1-o1,0) ;
        val2 = alpha_grid*s2 + beta_grid*max(s2-o2,0) ;

        subject_choice = data[t,7]

          if (subject_choice==1){
            pchoose2=(1./(1+exp(-(val1 - val2)))); # probability of 1
          } else {
            pchoose2=(1./(1+exp(-(val2 - val1)))); # probability of 2
          }

        belief_grid = pchoose2*belief_grid; # Bayes rule
        belief_grid = belief_grid / sum(as.vector(belief_grid)); #normalised distribution

    }

    return(belief_grid)

}

marginalise <- function(belief_grid){

  alpha_vec <- seq(0, 30, 0.125)
  beta_vec  <- seq(-30, 30, 0.25)

  alpha = colSums(belief_grid);
  beta  = rowSums(belief_grid);

  #find the indices of maximum likelihood after seeing the partner
  Ia            = which.max(alpha)
  Ib            = which.max(beta)
  mu_alphapar   = alpha_vec[Ia];
  mu_betapar    = beta_vec[Ib];

  return(c(mu_alphapar, mu_betapar))

}

# Utility -----------------------------------------------------------------

dbetasc <- function(x, shape1, shape2, lo=0, hi=1, ncp=0, log=FALSE){

  xtr <- (x-lo)/(hi-lo); # will work even if hi<lo
  if (log==FALSE) {
    return( dbeta( xtr, shape1, shape2, ncp, log)/abs(hi-lo) );
  }
  else {
    return( dbeta( xtr, shape1, shape2, ncp, log) - log(abs(hi-lo)) );
  }
}

mysamp <- function(n, m, s, lwr, upr, nnorm) {
  samp <- rnorm(nnorm, m, s)
  samp <- samp[samp >= lwr & samp <= upr]
  if (length(samp) >= n) {
    return(sample(samp, n))
  }
  stop(simpleError("Not enough values to sample from. Try increasing nnorm."))
}

# Wrapper function to load in existing variables and data
model_wrapper <- function(participant_responses) {
  return(
    matching_partner_incremental_fit(
        phase1data = participant_responses,
        precan_df,
        shuffle = T,
        file_loc = F)
  )
}

# Setup -----------------------------------------------------------------
full_data <- read.csv(text = paste0("${MODEL_DATA}")) %>% dplyr::select(-X)
precan_df <- precan_partners(full_data)
`;

/**
 * @summary Compute class used to run the model locally in the browser using WebR.
 */
class Compute {
  private webR: WebR;

  /**
   * Default constructor
   * @class
   */
  constructor() {
    this.webR = new WebR();
  }

  /**
   * Setup the computing functionality for WebR
   * @return {Promise<void>}
   */
  public async setup(): Promise<void> {
    await this.webR.init();
    await this.webR.installPackages([
      "matlab",
      "jsonlite",
      "doParallel",
      "dplyr",
      "logger",
    ]);

    await this.webR.evalR(FUNCTIONS);
  }

  /**
   * Utility function to handle a response received from WebR
   * @param {any[]} data Data returned by R functions
   * @return {any} Data structure containing reformatting model responses
   */
  private handleResponse(data: any[]): ModelResponse {
    // Get the participant parameters
    const participantParameters = data[0].values;

    // Get the parenter parameters, convert string to two floats
    const partnerParameters = [
      ...data[1].values[0].split(" ").map((value: string) => parseFloat(value)),
    ];

    // Get the partner actions for following trials
    const partnerChoicesRaw = data[2].values;
    const partnerChoices = [] as ModelResponse["partnerChoices"];
    partnerChoicesRaw[0].values.forEach((_: number, index: number) => {
      partnerChoices.push({
        ppt1: partnerChoicesRaw[0].values[index],
        par1: partnerChoicesRaw[1].values[index],
        ppt2: partnerChoicesRaw[2].values[index],
        par2: partnerChoicesRaw[3].values[index],
        Ac: partnerChoicesRaw[4].values[index],
      });
    });

    return {
      participantParameters: participantParameters,
      partnerParameters: partnerParameters,
      partnerChoices: partnerChoices,
    };
  }

  /**
   * Submit a new computing job to the remote resource
   * @param {any[]} data request parameters
   * @param {function(data: any): void} callback
   */
  public async submit(
    data: any[],
    callback: (data: any) => void
  ): Promise<void> {
    const startTime = performance.now();

    // Note: Need to format JSON with " rather than '
    const result = await this.webR.evalR(
      `model_wrapper(fromJSON('${JSON.stringify(data)}'))`
    );
    const parsed: WebRDataJsNode = (await result.toJs()) as WebRDataJsNode;

    const parameters = this.handleResponse(parsed.values);
    callback(parameters);

    const endTime = performance.now();
    consola.info(`Compute complete after ${Math.round(endTime - startTime)}ms`);
  }
}

export default Compute;
